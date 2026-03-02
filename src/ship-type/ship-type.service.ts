import { Injectable } from '@nestjs/common';
import { ShipTypeEntity } from './ship-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ShipTypeService {
  constructor(
    @InjectRepository(ShipTypeEntity)
    private readonly shipTypeRepository: Repository<ShipTypeEntity>,
  ) {}
  async findAll(manager: EntityManager) {
    return manager.find(ShipTypeEntity);
  }
}
