import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('user_fcm_tokens')
@Unique(['user', 'device_id']) 
@Index('IDX_fcm_token', ['fcmToken'])
export class FcmToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.fcmTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column({ name: 'device_id', type: 'varchar', length: 200 })
  device_id: string;

  @Column({ name: 'fcm_token', type: 'text' })
  fcmToken: string;
 
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

