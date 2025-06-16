import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Property } from './property.entity';
import { Direction } from '../enums/direction.enum';
import { RentalPeriod } from '../enums/rental-period.enum';
import { PropertyStatus} from '../enums/property-status.enum';
import { ListingType } from '../enums/listing-type.enum';
import { OwnershipType } from '../enums/ownership-type.enum';
import { UserPropertyPurchase } from './user-property-purchase.entity';


@Entity('residentials')
export class Residential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OwnershipType })
  ownership_type: OwnershipType;

  @Column({ type: 'enum', enum: Direction })
  direction: Direction;

  @Column({ type: 'float',nullable: true })
  monthly_price: number;

  @Column({ type: 'enum', enum: RentalPeriod ,nullable: true})
  rental_period: RentalPeriod;

  @Column({ type: 'boolean', default: false ,nullable : true})
  installment_allowed: boolean;

  @Column({ type: 'int', nullable: true })
  installment_duration: number;

  @Column({ type: 'enum', enum: PropertyStatus,default:PropertyStatus.AVAILABLE })
  status: PropertyStatus;

  @Column({ type: 'enum', enum: ListingType })
  listing_type: ListingType;

  @Column({ type: 'float' ,nullable : true})
  selling_price: number;

  @OneToOne(() => Property, (property) => property.residential, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @OneToMany(() => UserPropertyPurchase, (purchase) => purchase.residential)
  purchases: UserPropertyPurchase[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
