import { ShipInstanceEntity } from 'src/ship-instance/ship-instance.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

@Entity('ship_position')
@Index(['shipInstance', 'position'])
export class ShipPositionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShipInstanceEntity)
  shipInstance: ShipInstanceEntity;

  @Column()
  position: string;

  @Column()
  isHit: boolean;
}
