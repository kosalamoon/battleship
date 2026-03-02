import { Module } from '@nestjs/common';
import { GameShipService } from './game-ship.service';
import { GameShipController } from './game-ship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameShipEntity } from './game-ship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameShipEntity])],
  controllers: [GameShipController],
  providers: [GameShipService],
})
export class GameShipModule {}
