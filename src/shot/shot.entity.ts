import { GameEntity } from 'src/game/game.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

@Entity('shot')
@Index(['game', 'position'], { unique: true })
@Index(['game', 'createdAt'])
export class ShotEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  position: string;

  @Column()
  success: boolean;

  @ManyToOne(() => GameEntity)
  game: GameEntity;
}
