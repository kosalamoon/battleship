import { GameEntity } from 'src/game/game.entity';
import { ShipTypeEntity } from 'src/ship-type/ship-type.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game_ship')
export class GameShipEntity {
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
