
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Office } from './offices.entity';
import { Region } from './region.entity';
import { Residential } from './residential.entity';
import { AdminAgreement } from '../enums/admin-agreement.enum';
import { PropertyType} from '../enums/property-type.enum';
import { PropertyPost } from './property-posts.entitiy';
import { Image } from './image.entity';
import { UserPostSuggestion } from './user-post-suggestions.entity';
import { UserPropertyInvoice } from './user-property-invoice.entity';
import { User } from './user.entity';
import { PropertyFeedback } from './property-feedback.entity';
import { PropertyFavorite } from './property-favorite.entity';
import { Touristic } from './touristic.entity';


@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;
  
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'float' })
  area: number;

  @Column({ type: 'int',nullable:true })
  floor_number: number;

  @Column({ type: 'text', nullable: true })
  notes: string;


  @Column({ type: 'float', default: 0 })
  rate: number;

  @Column({ type: 'boolean', default: false })
  highlighted: boolean;

  @Column({ type: 'int', default: 0 })
  room_count: number;

  @Column({ type: 'int', default: 0 })
  bedroom_count: number;

  @Column({ type: 'int', default: 0 })
  living_room_count: number;

  @Column({ type: 'int', default: 0 })
  kitchen_count: number;

  @Column({ type: 'int', default: 0 })
  bathroom_count: number;

  @Column({ type: 'boolean', default: false })
  has_furniture: boolean;

  @Column({ type: 'enum', enum: PropertyType })
  property_type: PropertyType;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @ManyToOne(() => Office, (office) => office.properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'office_id' }) 
  office: Office;

  @ManyToOne(() => Region, (region) => region.properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'region_id' }) 
  region: Region;

  @OneToOne(() => Residential, (residential) => residential.property)
  residential: Residential;

  @OneToOne(() => PropertyPost, post => post.property)
  post: PropertyPost;

  @OneToMany(() => Image, (image) => image.property)
  images: Image[];
  
  @OneToMany(() => UserPostSuggestion,userPostSuggestion => userPostSuggestion.property)
  userPostSuggestions: UserPostSuggestion[];

  @OneToMany(() => UserPropertyInvoice, (invoice) => invoice.property)
  invoices: UserPropertyInvoice[];

  @OneToMany(() => PropertyFeedback, feedback => feedback.property)
  feedbacks: PropertyFeedback[];

  @OneToMany(() => PropertyFavorite, favorite => favorite.property)
  favoritedByUsers: PropertyFavorite[];

  @OneToOne(() => Touristic, (touristic) => touristic.property)
  touristic: Touristic;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
