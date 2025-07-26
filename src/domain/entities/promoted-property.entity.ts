import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./property.entity";
import { OnlineInvoice } from "./online-invoices.entity";

@Entity('promoted_properties')
export class PromotedProperty {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Property, (property) => property.promoted, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'property_id' })
    property: Property;
    
    @OneToOne(() => OnlineInvoice, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'online_invoice_id'})
    onlineInvoice: OnlineInvoice;

    @Column({type: 'int'})
    period: number;

    @Column({type: 'date'})
    start_date: Date;

    @CreateDateColumn()
    created_at: Date;
}