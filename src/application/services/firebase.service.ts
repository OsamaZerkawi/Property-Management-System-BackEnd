
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private messaging: admin.messaging.Messaging;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const configPath = process.env.FIREBASE_CONFIG_PATH;

      if (!configPath || !fs.existsSync(configPath)) {
        throw new Error('Firebase config path is missing or invalid');
      }

      const serviceAccount: ServiceAccount = require(path.resolve(configPath));

      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }

      this.messaging = admin.messaging();
    } catch (error) {
      this.logger.error('Error initializing Firebase Admin', error.stack);
      throw new Error('Failed to initialize Firebase Admin');
    }
  }

  async sendToDevice(token: string, notification: { title: string; body: string }, data?: any) {
    try {
      const message: admin.messaging.Message = {
        token,
        notification,
        data,
      };

      const response = await this.messaging.send(message);
      this.logger.log(`Notification sent: ${response}`);
      return response;
    } catch (error) {
      this.logger.error('Error sending notification', error.stack);
      throw error;
    }
  }

  async sendToDevices(tokens: string[], notification: { title: string; body: string }, data?: any) {
    try {
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification,
        data,
      };

      const response = await this.messaging.sendEachForMulticast(message);
      this.logger.log(`Sent: ${response.successCount}, Failed: ${response.failureCount}`);
      return response;
    } catch (error) {
      this.logger.error('Multicast notification failed', error.stack);
      throw error;
    }
  }

  
}
