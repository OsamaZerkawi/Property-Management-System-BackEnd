
// reminder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderService } from 'src/application/services/reminder.service';
import { CreateNotificationUseCase } from 'src/application/use-cases/notification/create-notification.use-case';
import { InvoiceReminderLog } from 'src/domain/entities/invoice-reminder-log.entity';
import { UserPropertyInvoice } from 'src/domain/entities/user-property-invoice.entity';
import { ReminderScheduler } from 'src/infrastructure/schedulers/reminder.scheduler';
import { NotificationModule } from './notification.module';
@Module({
  imports: [
    NotificationModule,
    TypeOrmModule.forFeature([UserPropertyInvoice, InvoiceReminderLog]),
  ],
  providers: [
    ReminderService,
    ReminderScheduler,
  ],
  exports: [ReminderService],
})
export class ReminderModule {}
