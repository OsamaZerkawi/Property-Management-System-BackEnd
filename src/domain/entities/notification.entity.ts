import { ColdObservable } from "rxjs/internal/testing/ColdObservable";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    data: Record<string, any>;

    @Column({ default: false })
    isRead: boolean;

    @Column({ type: 'timestamp' })
    sentAt: Date;

    @CreateDateColumn()
    createdAt: Date;    
}