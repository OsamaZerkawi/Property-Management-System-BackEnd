import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column('text')
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  data;

  @Column({ nullable: true })
  senderId: number;

  @Column({ nullable: true })
  senderName: string;

  @ManyToOne(() => User, (user) => user.sentNotifications, { eager: true })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp' })
  sent_at: Date;
}
