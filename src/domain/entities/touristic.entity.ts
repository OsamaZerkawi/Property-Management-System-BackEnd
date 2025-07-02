import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TouristicStatus } from "../enums/touristic-status.enum";
import { Property } from "./property.entity";
import { Calendar } from "./calendar.entity";

@Entity('touristic')
export class Touristic {
   @PrimaryGeneratedColumn()
   id: number;   

   @Column({type: 'float'})
   price: number;   

   @Column({ type: 'enum', enum: TouristicStatus })
   status: TouristicStatus;

   @OneToOne(() => Property, (property) => property.touristic, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'property_id' })
   property: Property;

   @OneToMany(() => Calendar, (calendar) => calendar.touristic)
   calendars: Calendar[];

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;
}