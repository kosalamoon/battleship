import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipInstanceEntity } from 'src/ship-instance/ship-instance.entity';
import { ShipInstanceService } from 'src/ship-instance/ship-instance.service';
import { ShipPositionEntity } from 'src/ship-position/ship-position.entity';
import { ShipPositionService } from 'src/ship-position/ship-position.service';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { GameEntity } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly shipInstanceService: ShipInstanceService,
    private readonly shipPositionService: ShipPositionService,
    private readonly dataSource: DataSource,
  ) {}

  async startGame(): Promise<GameEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;
    let game: GameEntity;

    try {
      game = await this.createGame(manager);

      const instancesToPlace =
        await this.shipInstanceService.createBasedOnGameConfigs(game, manager);

      const positions = this.shipPositionService.initializeShipPositions(
        instancesToPlace.map((i) => ({
          shipInstanceId: i.id,
          size: i.shipType.size,
        })),
      );

      const positionEntities = positions.map((p) => ({
        position: p.position,
        isHit: false,
        shipInstance: { id: p.shipInstanceId } as ShipInstanceEntity,
      }));
      await queryRunner.manager.save(ShipPositionEntity, positionEntities);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return game;
  }

  async createGame(manager: EntityManager) {
    return manager.save(new GameEntity());
  }

  async findGame(id: string) {
    return this.gameRepository.findOne({ where: { id } });
  }
}
