import { Module } from '@nestjs/common';
import { ShipTypeService } from './ship-type.service';
import { ShipTypeController } from './ship-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipTypeEntity } from './ship-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipTypeEntity])],
  controllers: [ShipTypeController],
  providers: [ShipTypeService],
})
export class ShipTypeModule {}
