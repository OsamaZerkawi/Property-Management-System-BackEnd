import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AdminAgreement } from "../enums/admin-agreement.enum";
import { Office } from "./offices.entity";
import { OnlineInvoice } from "./online-invoices.entity";

@Entity('advertisements')   
export class Advertisement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    day_period: number;

    @Column({nullable: true})
    start_date: Date;

    @Column()
    image: string;

    @Column({type:'enum',enum:AdminAgreement,default: AdminAgreement.PENDING})
    admin_agreement: AdminAgreement;

    @Column({type:'boolean',default: false})
    is_paid: boolean;

    @Column({type: 'boolean',default: false})  
    is_active: boolean;

    @ManyToOne(() => Office, (office) => office.advertisements,{onDelete:'CASCADE'})
    @JoinColumn({name: 'office_id'})
    office: Office;

    @OneToOne(() => OnlineInvoice, (invoice) => invoice.advertisement,{cascade: true,nullable:true})
    @JoinColumn({name: 'online_invoice_id'})
    invoice: OnlineInvoice| null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}