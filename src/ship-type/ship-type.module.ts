import { Module } from '@nestjs/common';
import { ShipTypeService } from './ship-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipTypeEntity } from './ship-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipTypeEntity])],
  providers: [ShipTypeService],
})
export class ShipTypeModule {}
