// services.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AdditionalService } from './additional-service.entity' 

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @OneToMany(
    () => AdditionalService,
    (additionalService) => additionalService.service,
  )
  additionalServices: AdditionalService[];
}
