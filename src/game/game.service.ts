import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GameShipService } from 'src/game-ship/game-ship.service';
import { ShipPositionService } from 'src/ship-position/ship-position.service';
import { ShipTypeService } from 'src/ship-type/ship-type.service';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { GameEntity } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly gameShipService: GameShipService,
    private readonly shipPositionService: ShipPositionService,
    private readonly shipTypeService: ShipTypeService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async startGame() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;
    try {
      const shipTypes = await this.shipTypeService.findAll(manager);
      const game = await this.createGame(manager);

      for (const shipType of shipTypes) {
        const gameShip = await this.gameShipService.create(
          { game, shipType, hitCount: 0, isSunk: false },
          manager,
        );
      }
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async createGame(manager: EntityManager) {
    return manager.save(new GameEntity());
  }

  async findGame(id: string) {
    return this.gameRepository.findOne({ where: { id } });
  }
}
