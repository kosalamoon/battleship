import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShotService } from './shot.service';
import { ShotController } from './shot.controller';
import { ShotEntity } from './shot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShotEntity])],
  controllers: [ShotController],
  providers: [ShotService],
  exports: [ShotService],
})
export class ShotModule {}
