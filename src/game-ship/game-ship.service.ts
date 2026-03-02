import { Injectable } from '@nestjs/common';
import { GameShipEntity } from './game-ship.entity';
import { EntityManager } from 'typeorm';

type CreateGameShip = Omit<GameShipEntity, 'id'>;

@Injectable()
export class GameShipService {
  async create(gameShip: CreateGameShip, manager: EntityManager) {
    return manager.save(gameShip);
  }
}
