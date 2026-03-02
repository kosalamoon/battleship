import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ship_type')
export class ShipTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  size: number;
}
