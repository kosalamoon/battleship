import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShotService } from './shot.service';
import { ShotEntity } from './shot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShotEntity])],
  providers: [ShotService],
  exports: [ShotService],
})
export class ShotModule {}
