import { Injectable, Logger } from '@nestjs/common';
const Queue = require('promise-queue');
import { FirebaseService } from 'src/application/services/firebase.service';

@Injectable()
export class NotificationQueueService {
  private readonly queue: typeof Queue.prototype;
  private readonly logger = new Logger(NotificationQueueService.name);

  constructor(private readonly firebaseService: FirebaseService) {
    this.queue = new Queue(5, Infinity);
  }

  async sendToDevice(token: string, title: string, body: string, data?: any) {
    await this.queue.add(async () => {
      this.logger.log(`📤 Sending to device...`);
      this.firebaseService.sendToDevice(token, { title, body }, data);
      this.logger.log('✅ Notification sent');
    });
  }

  async sendToDevices(tokens: string[], title: string, body: string, data?: any) {
    await this.queue.add(async () => {
      this.logger.log(`📤 Sending to ${tokens.length} devices...`);
      this.firebaseService.sendToDevices(tokens, { title, body }, data);
      this.logger.log('✅ Notification sent');
    });
  }
}
