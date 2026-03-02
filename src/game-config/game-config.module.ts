import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameConfigEntity } from './game-config.entity';
import { GameConfigService } from './game-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameConfigEntity])],
  providers: [GameConfigService],
  exports: [GameConfigService],
})
export class GameConfigModule {}
