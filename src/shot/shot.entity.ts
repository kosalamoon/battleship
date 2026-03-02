import { GameEntity } from 'src/game/game.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shot')
export class ShotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: string;

  @Column()
  success: boolean;

  @ManyToOne(() => GameEntity)
  game: GameEntity;
}
