import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { GameShipModule } from 'src/game-ship/game-ship.module';
import { ShipPositionModule } from 'src/ship-position/ship-position.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity]),
    GameShipModule,
    ShipPositionModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
