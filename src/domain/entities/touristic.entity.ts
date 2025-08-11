import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TouristicStatus } from "src/domain/enums/touristic-status.enum";
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

   @Column({ length: 255 })   
   electricity: string;

   @Column({ length: 255 })
   water: string;

   @Column({ length: 255 })
   pool: string; 

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
   @CreateDateColumn({select: false})
   created_at: Date;

   @UpdateDateColumn({select: false})
   updated_at: Date;
}