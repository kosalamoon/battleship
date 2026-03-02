import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipInstanceController } from './ship-instance.controller';
import { ShipInstanceEntity } from './ship-instance.entity';
import { ShipInstanceService } from './ship-instance.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShipInstanceEntity])],
  controllers: [ShipInstanceController],
  providers: [ShipInstanceService],
  exports: [ShipInstanceService],
})
export class ShipInstanceModule {}
