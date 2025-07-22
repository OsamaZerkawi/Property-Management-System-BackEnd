import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { errorResponse } from 'src/shared/helpers/response.helper';
@Injectable()
export class MailService {

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

    async sendJoinRequestApproval(
    email: string, 
    firstName: string, 
    lastName: string, 
    username: string, 
    password: string,
    agentType: string
  ) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_FROM || '"Propoly" <no-reply@yourapp.com>',
      to: email,
      subject: '🎉 تم قبول طلب الانضمام - مرحباً بك في الفريق',
      text: `مرحباً ${firstName} ${lastName},\n\nيسعدنا إبلاغك بأنه تم قبول طلب انضمامك كـ ${agentType}!\n\nبيانات الدخول:\nاسم المستخدم: ${username}\nكلمة المرور: ${password}\n\nيرجى تغيير كلمة المرور عند تسجيل الدخول لأول مرة.\n\nشكراً لك،\nفريق التطبيق`,
      html: this.getApprovalEmailTemplate(firstName, lastName, username, password, agentType),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Join request approval email sent:', nodemailer.getTestMessageUrl(info) || info.messageId);
    } catch (err) {
      console.error('Error sending approval email:', err);
      throw new InternalServerErrorException(
          errorResponse('حدث خطأ أثناء إرسال بيانات الدخول للمشرف عبر البريد الإلكتروني',500)
      );
    }
  }

  async sendJoinRequestRejection(
    email: string, 
    firstName: string, 
    lastName: string, 
    reason: string,
    agentType: string
  ) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_FROM || '"Propoly" <no-reply@yourapp.com>',
      to: email,
      subject: '❌ تم رفض طلب الانضمام',
      text: `مرحباً ${firstName} ${lastName},\n\nنشكرك على اهتمامك بالانضمام إلى فريقنا كـ ${agentType}.\n\nللأسف، لم يتم قبول طلب الانضمام الخاص بك في الوقت الحالي.\n\nسبب الرفض: ${reason}\n\nيمكنك المحاولة مرة أخرى في المستقبل.\n\nشكراً لك،\nفريق التطبيق`,
      html: this.getRejectionEmailTemplate(firstName, lastName, reason, agentType),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Join request rejection email sent:', nodemailer.getTestMessageUrl(info) || info.messageId);
    } catch (err) {
      console.error('Error sending rejection email:', err);
      throw new InternalServerErrorException(
          errorResponse('حدث خطأ أثناء إرسال بيانات الدخول للمشرف عبر البريد الإلكتروني',500)
      );
    }
  }

    async sendAdminCredentials(email: string, username: string, password: string) {
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_FROM || '"Propoly" <no-reply@yourapp.com>',
        to: email,
        subject: '🔑 بيانات الدخول للوحة الإدارة - مرحباً بك كمشرف',
        text: `مرحباً،\n\nتم إنشاء حساب إداري جديد لك بنجاح!\n\nبيانات الدخول:\nاسم المستخدم: ${username}\nكلمة المرور: ${password}\n\nشكراً لك،\nفريق التطبيق`,
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>بيانات الدخول للإدارة</title>
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
                          <span style="font-size: 36px; color: white;">🔑</span>
                        </div>
                        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">بيانات الدخول للإدارة</h1>
                        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 400;">حساب إداري جديد</p>
                      </td>
                    </tr>
                    
                    <!-- المحتوى الرئيسي -->
                    <tr>
                      <td style="padding: 50px 40px;">
                        <div style="text-align: center;">
                          <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 24px; font-weight: 600;">مرحباً بك في فريق الإدارة!</h2>
                          <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                            تم إنشاء حساب إداري جديد لك بنجاح. استخدم البيانات التالية للوصول إلى لوحة الإدارة
                          </p>
                          
                          <!-- بيانات الدخول -->
                          <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; margin: 30px 0; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(102,126,234,0.03) 0%, transparent 70%); animation: pulse 3s ease-in-out infinite;"></div>
                            
                            <!-- اسم المستخدم -->
                            <div style="margin-bottom: 25px; position: relative; z-index: 1;">
                              <p style="margin: 0 0 8px; color: #718096; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">اسم المستخدم</p>
                              <div style="background: #ffffff; border: 1px solid #cbd5e0; border-radius: 8px; padding: 15px; font-size: 18px; font-weight: 600; color: #2d3748; font-family: 'Courier New', monospace; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                ${username}
                              </div>
                            </div>
                            
                            <!-- كلمة المرور -->
                            <div style="position: relative; z-index: 1;">
                              <p style="margin: 0 0 8px; color: #718096; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">كلمة المرور</p>
                              <div style="background: #ffffff; border: 1px solid #cbd5e0; border-radius: 8px; padding: 15px; font-size: 18px; font-weight: 600; color: #2d3748; font-family: 'Courier New', monospace; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                ${password}
                              </div>
                            </div>
                          </div>
                          
    
                        </div>
                      </td>
                    </tr>
                    
                    <!-- الفوتر -->
                    <tr>
                      <td style="background: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 15px; color: #718096; font-size: 14px; line-height: 1.6;">
                          إذا لم تطلب هذا الحساب أو تواجه أي مشكلة، يرجى الاتصال بالدعم الفني فوراً.
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
                          هل تحتاج مساعدة؟ <a href="#" style="color: white; text-decoration: underline;">اتصل بالدعم الفني</a>
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
                
                div[style*="font-size: 18px"] {
                  font-size: 16px !important;
                }
                
                a[style*="padding: 15px 30px"] {
                  padding: 12px 25px !important;
                  font-size: 14px !important;
                }
              }
            </style>
          </body>
          </html>
        `,
      };
    
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Admin credentials email sent:', nodemailer.getTestMessageUrl(info) || info.messageId);
      } catch (err) {
        console.error('Error sending admin credentials email:', err);
        throw new InternalServerErrorException(
            errorResponse('حدث خطأ أثناء إرسال بيانات الدخول للمشرف عبر البريد الإلكتروني',500)
        );
      }
    }

    private getApprovalEmailTemplate(firstName: string, lastName: string, username: string, password: string, agentType: string): string {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تم قبول طلب الانضمام</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #10b981 0%, #059669 100%); min-height: 100vh;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); min-height: 100vh;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 520px; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                    <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                      <span style="font-size: 36px; color: white;">🎉</span>
                    </div>
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">تم قبول طلبك!</h1>
                    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 400;">مرحباً بك في الفريق</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 50px 40px;">
                    <div style="text-align: center;">
                      <h2 style="margin: 0 0 20px; color: #065f46; font-size: 24px; font-weight: 600;">مرحباً ${firstName} ${lastName}</h2>
                      <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                        يسعدنا إبلاغك بأنه تم قبول طلب انضمامك كـ <strong style="color: #059669;">${agentType}</strong>! 
                        لقد تم إنشاء حسابك بنجاح ويمكنك الآن الوصول إلى لوحة التحكم.
                      </p>
                      
                      <!-- Success Badge -->
                      <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin: 30px 0;">
                        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                          <span style="font-size: 24px; margin-left: 10px;">✅</span>
                          <span style="color: #065f46; font-weight: 600; font-size: 18px;">تم قبول الطلب بنجاح</span>
                        </div>
                      </div>
                      
                      <!-- Credentials -->
                      <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; margin: 30px 0; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 70%); animation: pulse 3s ease-in-out infinite;"></div>
                        
                        <div style="text-align: center; position: relative; z-index: 1; margin-bottom: 25px;">
                          <h3 style="margin: 0; color: #374151; font-size: 18px; font-weight: 600;">بيانات الدخول الخاصة بك</h3>
                        </div>
                        
                        <!-- Username -->
                        <div style="margin-bottom: 25px; position: relative; z-index: 1;">
                          <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">اسم المستخدم</p>
                          <div style="background: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; padding: 15px; font-size: 18px; font-weight: 600; color: #374151; font-family: 'Courier New', monospace; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            ${username}
                          </div>
                        </div>
                        
                        <!-- Password -->
                        <div style="position: relative; z-index: 1;">
                          <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">كلمة المرور</p>
                          <div style="background: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; padding: 15px; font-size: 18px; font-weight: 600; color: #374151; font-family: 'Courier New', monospace; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            ${password}
                          </div>
                        </div>
                      </div>
                      
                      <!-- Security Notice -->
                      <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: right;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                          <span style="font-size: 20px; margin-left: 10px;">⚠️</span>
                          <strong style="color: #92400e; font-size: 16px;">تنبيه أمني مهم</strong>
                        </div>
                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                          يرجى تغيير كلمة المرور عند تسجيل الدخول لأول مرة لضمان أمان حسابك.
                        </p>
                      </div>
                      
                      <!-- Login Button -->
                      <div style="margin: 35px 0;">
                        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16,185,129,0.3); transition: all 0.3s ease;">
                          الدخول إلى لوحة التحكم
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      إذا واجهت أي مشكلة في تسجيل الدخول، يرجى الاتصال بالدعم الفني.
                    </p>
                    <div style="height: 1px; background: #e5e7eb; margin: 20px 0;"></div>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      هذه رسالة آلية، يرجى عدم الرد عليها<br>
                      <strong style="color: #10b981;">فريق التطبيق</strong> &copy; 2025
                    </p>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 520px; margin-top: 20px;">
                <tr>
                  <td style="text-align: center; padding: 20px;">
                    <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 13px;">
                      هل تحتاج مساعدة؟ <a href="#" style="color: white; text-decoration: underline;">اتصل بالدعم الفني</a>
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
            table[role="presentation"] { width: 100% !important; }
            td[style*="padding: 50px 40px"] { padding: 30px 20px !important; }
            td[style*="padding: 40px 30px"] { padding: 30px 20px !important; }
            td[style*="padding: 30px 40px"] { padding: 20px !important; }
            div[style*="font-size: 18px"] { font-size: 16px !important; }
            a[style*="padding: 15px 40px"] { padding: 12px 30px !important; font-size: 14px !important; }
          }
        </style>
      </body>
      </html>
    `;
  }

  private getRejectionEmailTemplate(firstName: string, lastName: string, reason: string, agentType: string): string {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رد على طلب الانضمام</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); min-height: 100vh;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); min-height: 100vh;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 520px; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
                    <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                      <span style="font-size: 36px; color: white;">📝</span>
                    </div>
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">رد على طلب الانضمام</h1>
                    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 400;">شكراً لاهتمامك</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 50px 40px;">
                    <div style="text-align: center;">
                      <h2 style="margin: 0 0 20px; color: #374151; font-size: 24px; font-weight: 600;">مرحباً ${firstName} ${lastName}</h2>
                      <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                        نشكرك على اهتمامك بالانضمام إلى فريقنا كـ <strong style="color: #dc2626;">${agentType}</strong>.
                      </p>
                      
                      <!-- Status -->
                      <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #f87171; border-radius: 12px; padding: 25px; margin: 30px 0;">
                        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                          <span style="font-size: 24px; margin-left: 10px;">❌</span>
                          <span style="color: #b91c1c; font-weight: 600; font-size: 18px;">لم يتم قبول الطلب</span>
                        </div>
                        <p style="margin: 0; color: #7f1d1d; font-size: 14px;">
                          للأسف، لم يتم قبول طلب الانضمام الخاص بك في الوقت الحالي.
                        </p>
                      </div>
                      
                      <!-- Reason -->
                      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: right;">
                        <h3 style="margin: 0 0 15px; color: #374151; font-size: 16px; font-weight: 600;">سبب الرفض:</h3>
                        <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6; background: white; padding: 15px; border-radius: 8px; border-right: 4px solid #ef4444;">
                          ${reason}
                        </p>
                      </div>
                      
                      <!-- Encouragement -->
                      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #60a5fa; border-radius: 8px; padding: 25px; margin: 30px 0;">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                          <span style="font-size: 20px; margin-left: 10px;">💡</span>
                          <strong style="color: #1e40af; font-size: 16px;">لا تيأس!</strong>
                        </div>
                        <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                          يمكنك تحسين مؤهلاتك والتقديم مرة أخرى في المستقبل. نحن نقدر اهتمامك ونتطلع لسماع منك قريباً.
                        </p>
                      </div>
                      
                      <!-- Reapply Button -->
                      <div style="margin: 35px 0;">
                        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(99,102,241,0.3);">
                          التقديم مرة أخرى
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      إذا كان لديك أي استفسارات، يرجى الاتصال بفريق الدعم.
                    </p>
                    <div style="height: 1px; background: #e5e7eb; margin: 20px 0;"></div>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      هذه رسالة آلية، يرجى عدم الرد عليها<br>
                      <strong style="color: #ef4444;">فريق التطبيق</strong> &copy; 2025
                    </p>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 520px; margin-top: 20px;">
                <tr>
                  <td style="text-align: center; padding: 20px;">
                    <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 13px;">
                      هل تحتاج مساعدة؟ <a href="#" style="color: white; text-decoration: underline;">اتصل بالدعم الفني</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <style>
          @media only screen and (max-width: 600px) {
            table[role="presentation"] { width: 100% !important; }
            td[style*="padding: 50px 40px"] { padding: 30px 20px !important; }
            td[style*="padding: 40px 30px"] { padding: 30px 20px !important; }
            td[style*="padding: 30px 40px"] { padding: 20px !important; }
            a[style*="padding: 15px 30px"] { padding: 12px 25px !important; font-size: 14px !important; }
          }
        </style>
      </body>
      </html>
    `;
  }
}