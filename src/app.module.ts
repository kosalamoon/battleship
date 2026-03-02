import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameConfigModule } from './game-config/game-config.module';
import { ShipInstanceModule } from './ship-instance/ship-instance.module';
import { GameModule } from './game/game.module';
import { ShipPositionModule } from './ship-position/ship-position.module';
import { ShipTypeModule } from './ship-type/ship-type.module';
import { ShotModule } from './shot/shot.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        // type: 'sqlite',
        // database: config.get<string>('DATABASE_PATH'),
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    GameConfigModule,
    GameModule,
    ShipTypeModule,
    ShipInstanceModule,
    ShipPositionModule,
    ShotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
