import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Residential } from "./residential.entity";
import { PurchaseStatus } from "../enums/property-purchases.enum";

@Entity('user_property_purchases')  
export class UserPropertyPurchase {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.propertyPurchases,{onDelete:'CASCADE'})
    @JoinColumn({name:'user_id'})
    user: User;

    @ManyToOne(() => Residential, (residential) => residential.purchases, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'residential_id' })
    residential: Residential;

    @Column({nullable: true})
    end_booking: Date;

    @Column({ type: 'enum', enum: PurchaseStatus })
    status: PurchaseStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}