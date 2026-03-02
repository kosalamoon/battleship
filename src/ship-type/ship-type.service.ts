import { Injectable } from '@nestjs/common';
import { ShipTypeEntity } from './ship-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ShipTypeService {
  constructor(
    @InjectRepository(ShipTypeEntity)
    private readonly shipTypeRepository: Repository<ShipTypeEntity>,
  ) {}
  async displayData() {
    await this.shipTypeRepository.deleteAll();

    await this.shipTypeRepository.save([
      { name: 'Carrier', size: 5 },
      { name: 'Battleship', size: 4 },
      { name: 'Cruiser', size: 3 },
      { name: 'Submarine', size: 3 },
    ]);

    const shipTypes = await this.shipTypeRepository.find();
    console.log('Ship types in database:', shipTypes);
  }
}
