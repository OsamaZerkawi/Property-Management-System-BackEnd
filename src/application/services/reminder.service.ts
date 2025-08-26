import {
  subDays,
  addDays,
  isAfter,
} from 'date-fns';
import { Repository, Between, MoreThan } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ReminderType } from 'src/domain/enums/reminder-type.enum';
import { UserPropertyInvoice } from 'src/domain/entities/user-property-invoice.entity';
import { InvoiceReminderLog } from 'src/domain/entities/invoice-reminder-log.entity';
import { CreateNotificationUseCase } from '../use-cases/notification/create-notification.use-case';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoicesStatus } from 'src/domain/enums/invoices-status.enum';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    @InjectRepository(UserPropertyInvoice)
    private readonly invoiceRepo: Repository<UserPropertyInvoice>,
    @InjectRepository(InvoiceReminderLog)
    private readonly invoiceReminderLogRepo: Repository<InvoiceReminderLog>,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  // 1. إنشاء/جدولة سجلات التذكير عند إنشاء فاتورة
  async scheduleRemindersForInvoice(invoice: UserPropertyInvoice) {
    if (!invoice.payment_deadline) return;

    if (!invoice.user) {
      const invoiceWithUser = await this.invoiceRepo.findOne({
        where: { id: invoice.id },
        relations: ['user'],
      });
      if (!invoiceWithUser) return;
      invoice = invoiceWithUser;
    }

    const now = new Date();
    const deadline = invoice.payment_deadline;

    const plans: Array<{ type: ReminderType; when: Date }> = [
      { type: ReminderType.BEFORE_3_DAYS, when: subDays(deadline, 3) },
      { type: ReminderType.BEFORE_1_DAY, when: subDays(deadline, 1) },
      { type: ReminderType.DUE_TODAY, when: deadline },
      { type: ReminderType.OVERDUE, when: addDays(deadline, 1) },
    ];

    for (const p of plans) {
      if (!isAfter(p.when, now)) continue; // لا ننشئ تذكير في الماضي

      const existing = await this.invoiceReminderLogRepo.findOne({
        where: {
          invoiceId: invoice.id,
          reminderType: p.type,
          scheduledAt: p.when,
        },
      });
      if (existing) continue;

      const log = this.invoiceReminderLogRepo.create({
        invoiceId: invoice.id,
        userId: invoice.user.id,
        reminderType: p.type,
        scheduledAt: p.when,
        sentAt: null,
        succeeded: false,
        failureReason: null,
      });
      await this.invoiceReminderLogRepo.save(log);
    }
  }

  // 2. فحص وإرسال التذكيرات المستحقة (تُستدعى من كرون أو timer)
  async runDueReminders() {
    const now = new Date();

    // نجيب السجلات التي موعدها <= الآن ولم تُرسل بعد
    const dueLogs = await this.invoiceReminderLogRepo.find({
      where: {
        succeeded: false,
        scheduledAt: MoreThan(new Date(0)), // dummy to satisfy typing
        // filter manually since TypeORM find with multiple conditions on same column is awkward:
      },
      order: { scheduledAt: 'ASC' },
    });

    for (const log of dueLogs) {
      if (log.scheduledAt > now) continue; // لم يحين وقتها بعد

      const invoice = await this.invoiceRepo.findOne({
        where: { id: log.invoiceId },
        relations: ['user', 'property', 'property.post'],
      });

      if (!invoice) continue;

      if (invoice.status !== InvoicesStatus.PENDING) {
        await this.invoiceReminderLogRepo.update(log.id, {
          sentAt: new Date(),
          succeeded: false,
          failureReason: `Invoice is no longer pending (${invoice.status})`,
        });
        continue;
      }

      // بناء الرسالة
      const title = this.buildTitle(log.reminderType as ReminderType, invoice);
      const body = this.buildBody(log.reminderType as ReminderType, invoice);

      try {
        await this.createNotificationUseCase.execute(
          invoice.user.id,
          title,
          body,
          'صاحب مكتب',
        );

        await this.invoiceReminderLogRepo.update(log.id, {
          sentAt: new Date(),
          succeeded: true,
          failureReason: null,
        });
      } catch (err: any) {
        await this.invoiceReminderLogRepo.update(log.id, {
          sentAt: new Date(),
          succeeded: false,
          failureReason: err.message || String(err),
        });
        this.logger.warn(`Failed to send reminder log ${log.id}: ${err.message || err}`);
      }
    }
  }

  private buildTitle(reminderType: ReminderType, invoice: UserPropertyInvoice): string {
    const propertyTitle = invoice.property?.post?.title || 'العقار';
  
    switch (reminderType) {
      case ReminderType.BEFORE_3_DAYS:
        return `تذكير: فاتورة "${propertyTitle}" مستحقة بعد ٣ أيام`;
      case ReminderType.BEFORE_1_DAY:
        return `تذكير أخير: غداً آخر مهلة دفع لفاتورة "${propertyTitle}"`;
      case ReminderType.DUE_TODAY:
        return `اليوم آخر مهلة دفع لفاتورة "${propertyTitle}"`;
      case ReminderType.OVERDUE:
        return `فاتورة "${propertyTitle}" تجاوزت مهلة الدفع`;
      default:
        return `تذكير بالدفع لفاتورة "${propertyTitle}"`;
    }
  }

  private buildBody(reminderType: ReminderType, invoice: UserPropertyInvoice): string {
    const amount = invoice.amount;
    const deadline = invoice.payment_deadline;
    const propertyTitle = invoice.property.post.title;

    switch (reminderType) {
       case ReminderType.BEFORE_3_DAYS:
         return `📅 تذكير: فاتورة "${propertyTitle}" بقيمة ${amount} مستحقة في ${deadline}. الرجاء السداد قبل انتهاء المهلة لتجنب أي تأخير.`;
       case ReminderType.BEFORE_1_DAY:
         return `⏳ تنبيه أخير: غداً هو آخر موعد لسداد فاتورة "${propertyTitle}" بقيمة ${amount} (${deadline}). يرجى السداد لتفادي أي إجراء لاحق.`;
       case ReminderType.DUE_TODAY:
         return `⚠️ اليوم هو آخر موعد لسداد فاتورة "${propertyTitle}" بقيمة ${amount} (${deadline}). بادر بالسداد الآن.`;
       case ReminderType.OVERDUE:
         return `❌ فاتورة "${propertyTitle}" بقيمة ${amount} قد تجاوزت موعد السداد (${deadline}). يرجى السداد فوراً لتفادي إلغاء الحجز أو الإجراءات القانونية.`;
    }
  }

  // عند تغير الحالة (مثلاً تم الدفع) نلغي التذكيرات المستقبلية منطقياً
  async onInvoiceStatusChange(invoice: UserPropertyInvoice) {
    if (invoice.status === InvoicesStatus.PENDING) return;

    const futureLogs = await this.invoiceReminderLogRepo.find({
      where: {
        invoiceId: invoice.id,
        succeeded: false,
        scheduledAt: MoreThan(new Date()),
      },
    });

    for (const log of futureLogs) {
      await this.invoiceReminderLogRepo.update(log.id, {
        sentAt: new Date(),
        succeeded: false,
        failureReason: 'Invoice resolved before reminder (paid/cancelled)',
      });
    }
  }
}
