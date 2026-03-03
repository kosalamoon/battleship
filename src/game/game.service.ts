import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GameStateResponseDto } from './dto/game-state-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipInstanceEntity } from 'src/ship-instance/ship-instance.entity';
import { ShipInstanceService } from 'src/ship-instance/ship-instance.service';
import { ShipPositionEntity } from 'src/ship-position/ship-position.entity';
import { ShipPositionService } from 'src/ship-position/ship-position.service';
import { ShotService } from 'src/shot/shot.service';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ShootRequestDto } from './dto/shoot-request.dto';
import { ShootResponseDto } from './dto/shoot-response.dto';
import { StartGameResponseDto } from './dto/start-game-response.dto';
import { GameEntity } from './game.entity';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly shipInstanceService: ShipInstanceService,
    private readonly shipPositionService: ShipPositionService,
    private readonly shotService: ShotService,
    private readonly dataSource: DataSource,
  ) {}

  async startGame(): Promise<StartGameResponseDto> {
    this.logger.log('Creating new game...');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    let game: GameEntity;
    let shipInstances: ShipInstanceEntity[];

    try {
      game = await this.createGame(manager);
      this.logger.log(`Game created with id: ${game.id}`);

      shipInstances = await this.shipInstanceService.createBasedOnGameConfigs(
        game,
        manager,
      );

      this.logger.debug(
        `Created ship instances: ${JSON.stringify(
          shipInstances.map((i) => ({
            id: i.id,
            shipType: i.shipType.name,
            size: i.shipType.size,
          })),
        )}`,
      );

      const positions = this.shipPositionService.initializeShipPositions(
        shipInstances.map((i) => ({
          shipInstanceId: i.id,
          size: i.shipType.size,
        })),
      );

      this.logger.debug(
        `Ship positions initialized for ${positions.length} cells`,
      );

      const positionEntities = positions.map((p) => ({
        position: p.position,
        isHit: false,
        shipInstance: { id: p.shipInstanceId } as ShipInstanceEntity,
      }));
      await manager.save(ShipPositionEntity, positionEntities);

      await queryRunner.commitTransaction();
      this.logger.log(
        `Game ${game.id} started successfully — transaction committed`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to start game', error?.stack || error);

      if (error instanceof Error && error.message.includes('Failed to place')) {
        throw new InternalServerErrorException(
          'Failed to place ships on the grid',
        );
      }
      throw new InternalServerErrorException('Failed to start game');
    } finally {
      await queryRunner.release();
    }

    return this.buildStartGameResponse(game, shipInstances);
  }

  async shoot(dto: ShootRequestDto): Promise<ShootResponseDto> {
    this.logger.log(
      `Processing shot: game=${dto.gameId}, position=${dto.position}`,
    );

    const game = await this.validateGameForShot(dto.gameId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      const existingShot = await this.shotService.findByGameAndPosition(
        dto.gameId,
        dto.position,
        manager,
      );
      if (existingShot) {
        this.logger.log(
          `Duplicate shot at ${dto.position} for game ${dto.gameId}`,
        );
        await queryRunner.rollbackTransaction();
        return {
          gameId: dto.gameId,
          position: dto.position,
          result: 'ALREADY_SHOT',
          gameOver: false,
          gameStatus: game.status,
        };
      }

      if (game.status === 'NOT_STARTED') {
        game.status = 'IN_PROGRESS';
        await manager.save(GameEntity, game);
        this.logger.log(`Game ${dto.gameId} status changed to IN_PROGRESS`);
      }

      const shipPosition = await this.shipPositionService.findByPositionAndGame(
        dto.position,
        dto.gameId,
        manager,
      );

      if (!shipPosition) {
        this.logger.log(`Miss at ${dto.position} for game ${dto.gameId}`);
        await this.shotService.create(dto.gameId, dto.position, false, manager);
        await queryRunner.commitTransaction();
        return {
          gameId: dto.gameId,
          position: dto.position,
          result: 'MISS',
          gameOver: false,
          gameStatus: game.status,
        };
      }

      this.logger.log(
        `Hit at ${dto.position} on ${shipPosition.shipInstance.shipType.name}`,
      );
      const { shipSunk, gameOver } = await this.processHit(
        shipPosition,
        dto.gameId,
        game,
        manager,
      );

      await queryRunner.commitTransaction();
      this.logger.log(`Shot processed successfully for game ${dto.gameId}`);

      return {
        gameId: dto.gameId,
        position: dto.position,
        result: 'HIT',
        shipSunk,
        gameOver,
        gameStatus: game.status,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to process shot for game ${dto.gameId}`,
        error?.stack || error,
      );
      throw new InternalServerErrorException('Failed to process shot');
    } finally {
      await queryRunner.release();
    }
  }

  private async validateGameForShot(gameId: string): Promise<GameEntity> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      this.logger.warn(`Game not found: ${gameId}`);
      throw new NotFoundException('Game not found');
    }
    if (game.status === 'COMPLETED') {
      this.logger.warn(`Attempted shot on completed game: ${gameId}`);
      throw new BadRequestException('Game is already completed');
    }
    return game;
  }

  private async processHit(
    shipPosition: ShipPositionEntity,
    gameId: string,
    game: GameEntity,
    manager: EntityManager,
  ): Promise<{ shipSunk?: string; gameOver: boolean }> {
    await this.shipPositionService.markAsHit(shipPosition, manager);

    const { isSunk, shipTypeName } = await this.shipInstanceService.applyHit(
      shipPosition.shipInstance,
      manager,
    );

    await this.shotService.create(gameId, shipPosition.position, true, manager);

    let shipSunk: string | undefined;
    let gameOver = false;

    if (isSunk) {
      shipSunk = shipTypeName;
      this.logger.log(`Ship sunk: ${shipSunk} in game ${gameId}`);

      const unsunkCount = await this.shipInstanceService.countUnsunkByGame(
        gameId,
        manager,
      );
      if (unsunkCount === 0) {
        game.status = 'COMPLETED';
        await manager.save(GameEntity, game);
        gameOver = true;
        this.logger.log(`All ships sunk! Game ${gameId} completed`);
      }
    }

    return { shipSunk, gameOver };
  }

  async getGameState(gameId: string): Promise<GameStateResponseDto> {
    const game = await this.findGame(gameId);
    if (!game) {
      this.logger.warn(`Game not found: ${gameId}`);
      throw new NotFoundException('Game not found');
    }

    const shots = await this.shotService.findAllByGame(gameId);
    const shipsRemaining = await this.shipInstanceService.countUnsunkByGame(
      gameId,
      this.dataSource.manager,
    );

    return {
      gameId: game.id,
      status: game.status,
      gridSize: this.shipPositionService.gridSize,
      shots: shots.map((s) => ({ position: s.position, success: s.success })),
      shipsRemaining,
    };
  }

  async createGame(manager: EntityManager) {
    return manager.save(new GameEntity());
  }

  async findGame(id: string) {
    return this.gameRepository.findOne({ where: { id } });
  }

  private buildStartGameResponse(
    game: GameEntity,
    shipInstances: ShipInstanceEntity[],
  ): StartGameResponseDto {
    const shipCountMap = new Map<
      string,
      { shipType: string; size: number; count: number }
    >();

    for (const instance of shipInstances) {
      const key = instance.shipType.name;
      const existing = shipCountMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        shipCountMap.set(key, {
          shipType: instance.shipType.name,
          size: instance.shipType.size,
          count: 1,
        });
      }
    }

    return {
      gameId: game.id,
      status: game.status,
      gridSize: this.shipPositionService.gridSize,
      ships: Array.from(shipCountMap.values()),
    };
  }
}
