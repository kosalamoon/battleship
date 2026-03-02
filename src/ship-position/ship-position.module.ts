import { Module } from '@nestjs/common';
import { ShipPositionService } from './ship-position.service';
import { ShipPositionController } from './ship-position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipPositionEntity } from './ship-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipPositionEntity])],
  controllers: [ShipPositionController],
  providers: [ShipPositionService],
})
export class ShipPositionModule {}
