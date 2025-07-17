import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceType } from '../enums/service-type.enum';

@Entity('service_prices')
export class ServicePrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'enum',enum:ServiceType})
  service: ServiceType;

  @Column({ name: 'price_per_day', type: 'decimal' })
  pricePerDay: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}