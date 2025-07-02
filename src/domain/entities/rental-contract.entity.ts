// rental-contract.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Residential } from './residential.entity';

@Entity('rental_contracts')
export class RentalContract {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rentalContracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Residential, (residential) => residential.rentalContracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'residential_id' })
  residential: Residential;

  @Column({ type: 'varchar', length: 255})
  period: string;

  @Column({ type: 'date'})
  start_date: string;

  @Column({ type: 'date'})
  end_date: string;

  @Column({ type: 'decimal' })
  price_per_period: number;
}
