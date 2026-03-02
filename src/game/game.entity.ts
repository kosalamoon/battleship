import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type GameStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'NOT_STARTED' })
  status: GameStatus;

  @CreateDateColumn()
  createdAt: Date;
}
