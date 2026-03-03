import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ShipInstanceEntity } from './ship-instance.entity';
import { GameEntity } from 'src/game/game.entity';
import { GameConfigService } from 'src/game-config/game-config.service';

type CreateShipInstance = Omit<ShipInstanceEntity, 'id'>;

@Injectable()
export class ShipInstanceService {
  constructor(private readonly gameConfigService: GameConfigService) {}

  async createBasedOnGameConfigs(game: GameEntity, manager: EntityManager) {
    const configs = await this.gameConfigService.findAll(manager);
    const instances: ShipInstanceEntity[] = [];
    for (const config of configs) {
      for (let i = 0; i < config.count; i++) {
        instances.push(
          await this.create(
            { game, shipType: config.shipType, hitCount: 0, isSunk: false },
            manager,
          ),
        );
      }
    }
    return instances;
  }

  async create(shipInstance: CreateShipInstance, manager: EntityManager) {
    return manager.save(manager.create(ShipInstanceEntity, shipInstance));
  }

  async applyHit(
    shipInstance: ShipInstanceEntity,
    manager: EntityManager,
  ): Promise<{ isSunk: boolean; shipTypeName: string }> {
    shipInstance.hitCount += 1;
    if (shipInstance.hitCount >= shipInstance.shipType.size) {
      shipInstance.isSunk = true;
    }
    await manager.save(ShipInstanceEntity, shipInstance);
    return {
      isSunk: shipInstance.isSunk,
      shipTypeName: shipInstance.shipType.name,
    };
  }

  async countUnsunkByGame(
    gameId: string,
    manager: EntityManager,
  ): Promise<number> {
    return manager.count(ShipInstanceEntity, {
      where: { game: { id: gameId }, isSunk: false },
    });
  }
}
