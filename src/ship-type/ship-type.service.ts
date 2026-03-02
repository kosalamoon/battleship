import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { ShipTypeEntity } from './ship-type.entity';

@Injectable()
export class ShipTypeService {
  constructor(
    @InjectRepository(ShipTypeEntity)
    private readonly shipTypeRepository: Repository<ShipTypeEntity>,
  ) {}
  async findByName(name: string, manager?: EntityManager) {
    const options: FindOneOptions<ShipTypeEntity> = {
      where: { name },
    };
    if (manager) {
      return manager.findOne(ShipTypeEntity, options);
    }
    return this.shipTypeRepository.findOne(options);
  }
}
