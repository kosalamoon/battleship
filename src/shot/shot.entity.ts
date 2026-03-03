import { GameEntity } from 'src/game/game.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

@Entity('shot')
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
