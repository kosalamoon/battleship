import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipInstanceEntity } from 'src/ship-instance/ship-instance.entity';
import { ShipInstanceService } from 'src/ship-instance/ship-instance.service';
import { ShipPositionEntity } from 'src/ship-position/ship-position.entity';
import { ShipPositionService } from 'src/ship-position/ship-position.service';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
