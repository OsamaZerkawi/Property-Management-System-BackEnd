import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('user_fcm_tokens')
@Unique(['user', 'fcmToken'])
export class FcmToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.fcmTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  fcmToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
