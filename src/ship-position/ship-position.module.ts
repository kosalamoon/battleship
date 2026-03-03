import { Module } from '@nestjs/common';
import { ShipPositionService } from './ship-position.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipPositionEntity } from './ship-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipPositionEntity])],
  providers: [ShipPositionService],
  exports: [ShipPositionService],
})
export class ShipPositionModule {}
