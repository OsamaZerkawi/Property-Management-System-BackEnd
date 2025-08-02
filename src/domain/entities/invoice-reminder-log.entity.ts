import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ReminderType } from "../enums/reminder-type.enum";

@Entity('invoice_reminder_logs')
export class InvoiceReminderLog {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  invoiceId: number;
  @Column()
  userId: number;
  @Column({ type: 'enum',enum: ReminderType })
  reminderType: ReminderType;
  @Column({ type: 'timestamp with time zone' })
  scheduledAt: Date;
  @Column({ type: 'timestamp with time zone', nullable: true })
  sentAt: Date | null;
  @Column({ default: false })
  succeeded: boolean;
  @Column({ type: 'text', nullable: true })
  failureReason: string | null;
}
