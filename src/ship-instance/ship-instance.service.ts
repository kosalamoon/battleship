import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ShipInstanceEntity } from './ship-instance.entity';

type CreateShipInstance = Omit<ShipInstanceEntity, 'id'>;

@Injectable()
export class ShipInstanceService {
  async create(shipInstance: CreateShipInstance, manager: EntityManager) {
    return manager.save(shipInstance);
  }
}
