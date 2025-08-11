import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Touristic } from "./touristic.entity";
import { Booking } from "./booking.entity";
import { CalendarStatus } from "../enums/calendar-status.enum";
import { UserPropertyInvoice } from "./user-property-invoice.entity";

@Entity('calendars')
export class Calendar {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Touristic, (touristic) => touristic.calendars, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'touristic_id' })
    touristic: Touristic;
  
    @Column({ type: 'date' })
    start_date: Date;
  
    @Column({ type: 'date' })
    end_date: Date;
  
    @Column({ type: 'enum', enum: CalendarStatus})
    status: CalendarStatus;
  
    @OneToMany(() => Booking, (booking) => booking.calendar)
    bookings: Booking[];

    @OneToMany(() => UserPropertyInvoice, (invoice) => invoice.calendar)
    invoices: UserPropertyInvoice[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}