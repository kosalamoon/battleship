import { Module } from '@nestjs/common';
import { ShotService } from './shot.service';
import { ShotController } from './shot.controller';

@Module({
  controllers: [ShotController],
  providers: [ShotService],
})
export class ShotModule {}
