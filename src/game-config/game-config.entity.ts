import { ShipTypeEntity } from 'src/ship-type/ship-type.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game_config')
export class GameConfigEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => ShipTypeEntity, { eager: true })
  shipType: ShipTypeEntity;

  @Column()
  count: number;
}
