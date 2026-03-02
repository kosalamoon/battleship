import { Module } from '@nestjs/common';
import { ShipPositionService } from './ship-position.service';
import { ShipPositionController } from './ship-position.controller';

@Module({
  controllers: [ShipPositionController],
  providers: [ShipPositionService],
})
export class ShipPositionModule {}
