 
import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Touristic } from './touristic.entity';
import { Service } from './services.entity';

@Entity({ name: 'additional_services' })
export class AdditionalService {
  @PrimaryColumn({ name: 'touristic_id' })
  touristicId: number;

  @PrimaryColumn({ name: 'service_id' })
  serviceId: number;

  @ManyToOne(() => Touristic, (t) => t.additionalServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'touristic_id' })
  touristic: Touristic;

  @ManyToOne(() => Service, (s) => s.additionalServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
