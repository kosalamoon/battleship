import { GameEntity } from 'src/game/game.entity';
import { ShipTypeEntity } from 'src/ship-type/ship-type.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

@Entity('ship_instance')
@Index(['game', 'isSunk'])
@Index(['shipType'])
export class ShipInstanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GameEntity)
  game: GameEntity;

  @ManyToOne(() => ShipTypeEntity)
  shipType: ShipTypeEntity;

  @Column()
  hitCount: number;

  @Column()
  isSunk: boolean;
}
