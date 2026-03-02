import { ShipInstanceEntity } from 'src/ship-instance/ship-instance.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ship_position')
export class ShipPositionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShipInstanceEntity)
  shipInstance: ShipInstanceEntity;

  @Column()
  position: string;

  @Column()
  isHit: boolean;
}
