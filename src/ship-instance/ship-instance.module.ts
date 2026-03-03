import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipInstanceEntity } from './ship-instance.entity';
import { ShipInstanceService } from './ship-instance.service';
import { GameConfigModule } from 'src/game-config/game-config.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShipInstanceEntity]), GameConfigModule],
  providers: [ShipInstanceService],
  exports: [ShipInstanceService],
})
export class ShipInstanceModule {}
