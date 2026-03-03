import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { GameConfigModule } from 'src/game-config/game-config.module';
import { ShipInstanceModule } from 'src/ship-instance/ship-instance.module';
import { ShipPositionModule } from 'src/ship-position/ship-position.module';
import { ShipTypeModule } from 'src/ship-type/ship-type.module';
import { ShotModule } from 'src/shot/shot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity]),
    GameConfigModule,
    ShipInstanceModule,
    ShipPositionModule,
    ShipTypeModule,
    ShotModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
