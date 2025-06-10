import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Region } from './region.entity';
import { UserPostPropertyType } from '../enums/user-post-property-type.enum';

@Entity('user_posts')
export class UserPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.userPosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Region, region => region.userPosts, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget: number;

  @Column({ type: 'enum', enum: UserPostPropertyType })
  type: UserPostPropertyType;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
