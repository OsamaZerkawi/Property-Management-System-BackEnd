// src/infrastructure/services/otp.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
  private transporter: nodemailer.Transporter;

  constructor() { 
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',  
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  generateOtp(length = 4): string {
    return otpGenerator.generate(length, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
  }

  async sendOtp(email: string, otp: string) {
    const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_FROM || '"Propoly" <no-reply@yourapp.com>',
        to: email,
        subject: '🔐 رمز التحقق الخاص بك - تأكيد الحساب',
        text: `مرحباً،\n\nرمز التحقق الخاص بك هو: ${otp}\n\nهذا الرمز صالح لمدة 5 دقائق فقط.\n\nإذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.\n\nشكراً لك،\nفريق التطبيق`,
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>رمز التحقق</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <!-- بطاقة الإيميل الرئيسية -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 520px; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); overflow: hidden;">
                    
                    <!-- الهيدر -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                          <span style="font-size: 36px; color: white;">🔐</span>
                        </div>
                        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">رمز التحقق</h1>
                        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 400;">تأكيد الهوية الآمن</p>
                      </td>
                    </tr>
                    
                    <!-- المحتوى الرئيسي -->
                    <tr>
                      <td style="padding: 50px 40px;">
                        <div style="text-align: center;">
                          <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 24px; font-weight: 600;">مرحباً بك!</h2>
                          <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                            استخدم رمز التحقق التالي لإكمال عملية تأكيد حسابك بأمان
                          </p>
                          
                          <!-- رمز OTP -->
                          <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px dashed #cbd5e0; border-radius: 12px; padding: 30px; margin: 30px 0; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(102,126,234,0.03) 0%, transparent 70%); animation: pulse 3s ease-in-out infinite;"></div>
                            <p style="margin: 0 0 10px; color: #718096; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">رمز التحقق</p>
                            <div style="font-size: 36px; font-weight: 800; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; text-shadow: 0 2px 4px rgba(102,126,234,0.2); position: relative; z-index: 1;">${otp}</div>
                          </div>
                          
                          <!-- معلومات الصلاحية -->
                          <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                              <span style="font-size: 20px; margin-left: 8px;">⏰</span>
                              <span style="color: #c53030; font-weight: 600; font-size: 16px;">انتبه للوقت!</span>
                            </div>
                            <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.5;">
                              هذا الرمز صالح لمدة <strong>5 دقائق فقط</strong> من وقت إرسال هذه الرسالة
                            </p>
                          </div> 
                        </div>
                      </td>
                    </tr>
                    
                    <!-- الفوتر -->
                    <tr>
                      <td style="background: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 15px; color: #718096; font-size: 14px; line-height: 1.6;">
                          إذا لم تطلب رمز التحقق هذا، يمكنك تجاهل هذه الرسالة بأمان.
                        </p>
                        <div style="height: 1px; background: #e2e8f0; margin: 20px 0;"></div>
                        <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                          هذه رسالة آلية، يرجى عدم الرد عليها<br>
                          <strong style="color: #667eea;">فريق التطبيق</strong> &copy; 2025
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                  
                  <!-- رسالة إضافية تحت البطاقة -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 520px; margin-top: 20px;">
                    <tr>
                      <td style="text-align: center; padding: 20px;">
                        <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 13px;">
                          هل تواجه مشكلة؟ <a href="#" style="color: white; text-decoration: underline;">اتصل بالدعم الفني</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
            </table>
            
            <style>
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.3; }
                50% { transform: scale(1.05); opacity: 0.1; }
              }
              
              @media only screen and (max-width: 600px) {
                table[role="presentation"] {
                  width: 100% !important;
                }
                
                td[style*="padding: 50px 40px"] {
                  padding: 30px 20px !important;
                }
                
                td[style*="padding: 40px 30px"] {
                  padding: 30px 20px !important;
                }
                
                td[style*="padding: 30px 40px"] {
                  padding: 20px !important;
                }
                
                div[style*="font-size: 36px"] {
                  font-size: 28px !important;
                  letter-spacing: 4px !important;
                }
              }
            </style>
          </body>
          </html>
        `,
      };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent:', nodemailer.getTestMessageUrl(info) || info.messageId);
    } catch (err) {
      console.error('Error sending OTP email:', err);
      throw new InternalServerErrorException('Failed to send OTP');
    }
  }
  
}
