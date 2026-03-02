import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { ShipInstanceModule } from 'src/ship-instance/ship-instance.module';
import { ShipPositionModule } from 'src/ship-position/ship-position.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity]),
    ShipInstanceModule,
    ShipPositionModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
