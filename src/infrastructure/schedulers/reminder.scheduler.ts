
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReminderService } from 'src/application/services/reminder.service';

@Injectable()
export class ReminderScheduler {
  private readonly logger = new Logger(ReminderScheduler.name);
  private isRunning = false; // prevents overlapping runs

  constructor(private readonly reminderService: ReminderService) {}

  @Cron('0 0 * * *')
  async handleDueReminders() {
    if (this.isRunning) {
      this.logger.warn('Previous reminder run still in progress. Skipping this tick.');
      return;
    }

    this.isRunning = true;
    const start = Date.now();
    this.logger.debug('Starting reminder reconciliation / dispatch run.');

    try {
      // إذا لديك دالة اسمها runDueReminders (cron-based version)
      await this.reminderService.runDueReminders();
      const duration = Date.now() - start;
      this.logger.log(`✅ Reminder run completed in ${duration}ms.`);
    } catch (err) {
      this.logger.error('🔴 Reminder run failed', err);
    } finally {
      this.isRunning = false;
    }
  }
}
