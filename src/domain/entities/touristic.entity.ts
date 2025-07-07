import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TouristicStatus } from "../enums/touristic-status.enum";
import { Property } from "./property.entity";
import { Calendar } from "./calendar.entity";
import { AdditionalService } from './additional-service.entity' 

@Entity('touristic')
export class Touristic {
   @PrimaryGeneratedColumn()
   id: number;   

   @Column('decimal', { precision: 10, scale: 2 })
   price: number;   
 
   @Column({ length: 255 })
   street: string;

   @Column({ type: 'boolean', default: false })
   electricity: boolean;

   @Column({ type: 'boolean', default: false })
   water: boolean;

   @Column({ type: 'boolean', default: false })
   pool: boolean;

   @Column({ type: 'enum', enum: TouristicStatus })
   status: TouristicStatus;

   @OneToOne(() => Property, (property) => property.touristic, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'property_id' })
   property: Property;

   @OneToMany(() => Calendar, (calendar) => calendar.touristic)
   calendars: Calendar[];

   @OneToMany(
    () => AdditionalService,
    (additionalService) => additionalService.touristic,
    { cascade: true },
  )
  additionalServices: AdditionalService[];
   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;
}