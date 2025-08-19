import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InoviceReasons } from "../enums/inovice-reasons.enum";
import { InvoicesStatus } from "../enums/invoices-status.enum";
import { PaymentMethod } from "../enums/payment-method.enum";
import { User } from "./user.entity";
import { Property } from "./property.entity";
import { Calendar } from "./calendar.entity";

@Entity('user_property_invoices')
export class UserPropertyInvoice{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    amount: number;

    @Column({type:'enum',enum:InoviceReasons})
    reason: InoviceReasons;

    @Column({type:'enum', enum: InvoicesStatus})
    status:InvoicesStatus

    @Column({type: 'date',nullable: true})
    billing_period_start: Date;

    @Column({ type: 'varchar', nullable: true })
    stripePaymentIntentId: string;


    @Column({nullable:true})
    invoiceImage: string;

    @Column({type:'enum',enum:PaymentMethod,nullable: true})
    paymentMethod: PaymentMethod;

    @ManyToOne(() => User, (user) => user.invoices)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Property, (property) => property.invoices)
    @JoinColumn({ name: 'property_id' })
    property: Property;

    @ManyToOne(() => Calendar, (calendar) => calendar.invoices, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'calendar_id' })
    calendar: Calendar;

    @Column({type: 'date',nullable: true})
    payment_deadline: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn() 
    updated_at: Date;
}