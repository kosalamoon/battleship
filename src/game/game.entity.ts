import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

export type GameStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

@Entity('game')
export class GameEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'NOT_STARTED' })
  status: GameStatus;
}
