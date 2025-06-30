// src/infrastructure/services/otp.service.ts
import { Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class OtpService {
  generateOtp(length = 6): string {
    return otpGenerator.generate(length, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
  }

  async sendOtp(email: string, otp: string) {
    // ارسل الكود عبر البريد مثلاً باستخدام nodemailer أو أي خدمة
    console.log(`Sending OTP ${otp} to ${email}`);
    // await this.mailService.sendOtp(email, otp);
  }
}
