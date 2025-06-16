import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InoviceReasons } from "../enums/inovice-reasons.enum";
import { InvoicesStatus } from "../enums/invoices-status.enum";
import { PaymentMethod } from "../enums/payment-method.enum";
import { User } from "./user.entity";
import { Property } from "./property.entity";

@Entity('user_property_invoices')
export class UserPropertyInvoice{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'decimal',nullable: true})
    amount: number;

    @Column({type:'enum',enum:InoviceReasons})
    reason: InoviceReasons;

    @Column({type:'enum', enum: InvoicesStatus,})
    status:InvoicesStatus

    @Column({type:'integer',nullable:true})
    stripePaymentIntentId: number;

    @Column({nullable:true})
    invoiceImage: string;

    @Column({type:'enum',enum:PaymentMethod})
    paymentMethod: PaymentMethod;

    @ManyToOne(() => User, (user) => user.invoices)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Property, (property) => property.invoices)
    @JoinColumn({ name: 'property_id' })
    property: Property;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn() 
    updated_at: Date;
}