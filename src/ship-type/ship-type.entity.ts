import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ship_type')
export class ShipTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  size: number;
}
