import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from './property.entity';

@Entity('property_favorites')
@Unique(['user', 'property'])
export class PropertyFavorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.propertyFavorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Property, property => property.favoritedByUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}