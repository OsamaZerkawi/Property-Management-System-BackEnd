import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { FirebaseService } from 'src/application/services/firebase.service';

@Processor('notifications')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  @Process('send-notification')
  async handleSendNotification(job: Job) {
    const { tokens, title, body, data } = job.data;

    this.logger.log(`Sending notification to ${tokens.length} devices...`);

    await this.firebaseService.sendToDevices(tokens, { title, body }, data);

    this.logger.log(`Notification sent`);
  }

  @Process('send-to-device')
  async handleSendToDevice(job: Job) {
    const { token, title, body, data } = job.data;

    this.logger.log(`Sending queued notification to device...`);

    await this.firebaseService.sendToDevice(token, { title, body }, data);

    this.logger.log(`Notification sent successfully`);
  }
}
