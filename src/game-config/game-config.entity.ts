import { ShipTypeEntity } from 'src/ship-type/ship-type.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

@Entity('game_config')
export class GameConfigEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => ShipTypeEntity, { eager: true })
  shipType: ShipTypeEntity;

  @Column()
  count: number;
}
