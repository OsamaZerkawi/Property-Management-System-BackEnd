import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Region } from './region.entity';
import { Property } from './property.entity';
import {OfficeSocial} from './office-social.entity'
import { OfficeType } from '../enums/office-type.enum';
import { PaymentMethod } from '../enums/payment-method.enum';





@Entity('offices')
export class Office {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  logo: string;

  @Column({
    type: 'enum',
    enum: OfficeType,
  })
  type: OfficeType;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 4,
  })
  commission: number;

  @Column({
    type: 'int',
  })
  booking_period: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  deposit_per_m2: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  tourism_deposit: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  payment_method: PaymentMethod;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column({ type: 'time' })
  opening_time: string;

  @Column({ type: 'time' })
  closing_time: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  profits: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.office)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Region, region => region.offices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'region_id' }) 
  region: Region;

  @OneToMany(() => Property, (property) => property.office)
  properties: Property[];

  @OneToMany(() => OfficeSocial, social => social.office, { cascade: true })
  socials: OfficeSocial[];
  
  getPaymentMethod(): PaymentMethod {
    return this.payment_method;
  }
}