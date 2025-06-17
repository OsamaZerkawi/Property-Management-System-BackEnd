import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('service_prices')
export class ServicePrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  service: string;

  @Column({ name: 'price_per_day', type: 'decimal' })
  pricePerDay: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}