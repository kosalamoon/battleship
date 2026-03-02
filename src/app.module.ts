import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';
import { ShipTypeModule } from './ship-type/ship-type.module';
import { GameShipModule } from './game-ship/game-ship.module';
import { ShipPositionModule } from './ship-position/ship-position.module';
import { ShotModule } from './shot/shot.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
      type: 'sqlite',
        database: config.get<string>('DATABASE_PATH'),
      autoLoadEntities: true,
      synchronize: true,
      }),
      inject: [ConfigService],
    }),
    GameModule,
    ShipTypeModule,
    GameShipModule,
    ShipPositionModule,
    ShotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
