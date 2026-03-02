import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gridSize: number;
}
