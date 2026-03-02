import { GameShipEntity } from 'src/game-ship/game-ship.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ship_position')
export class ShipPositionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GameShipEntity)
  gameShip: GameShipEntity;

  @Column()
  position: string;

  @Column()
  isHit: boolean;
}
