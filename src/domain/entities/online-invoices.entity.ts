import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Office } from "./offices.entity";
import { Advertisement } from "./advertisements.entity";
import { InvoiceType } from "../enums/invoice.type.enum";

@Entity('online_invoices')
export class OnlineInvoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    stripe_payment_intent_id: number;

    @Column({type: 'float'})
    amount: number;

    @Column({type:'enum',enum: InvoiceType})
    type: InvoiceType;

    @Column({type: 'date',nullable: true})
    paid_date: Date;

    @ManyToOne(() => Office, (office) => office.invoices,{onDelete:'CASCADE'})
    @JoinColumn({name: 'office_id'})
    office: Office;

    @OneToOne(() => Advertisement,(advertisement) => advertisement.invoice, {onDelete: 'CASCADE'})
    advertisement: Advertisement;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}