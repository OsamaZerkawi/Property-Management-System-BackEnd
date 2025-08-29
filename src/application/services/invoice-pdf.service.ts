import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer-core';  

@Injectable()
export class InvoicePdfService {
  private readonly logger = new Logger(InvoicePdfService.name);
 
  private UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'invoices', 'user');
  private DEFAULT_FONT_PATH = path.join(process.cwd(), 'assets', 'fonts', 'Cairo-Regular.ttf');

  constructor() {
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
  }
 
  private escapeHtml(input: any) {
    if (input === null || input === undefined) return '';
    const s = String(input);
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

   private templateHtml = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <style>
    @font-face {
      font-family: 'CairoCustom';
      src: url('file:///{{fontPath}}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'CairoCustom', sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      color: #2d3748;
    }
    .wrapper { max-width: 900px; margin: 0 auto; }
    .card { 
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      padding: 40px;
      position: relative;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 6px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 35px;
      padding-bottom: 25px;
      border-bottom: 2px solid #f7fafc;
      position: relative;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0;
      width: 80px; height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }
    .title { 
      font-size: 28px; 
      font-weight: 800;
      color: #2d3748;
      margin-bottom: 8px;
    }
    .meta { 
      color: #718096; 
      font-size: 14px;
      font-weight: 500;
      line-height: 1.6;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      border-radius: 25px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
    }
    .grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 25px; 
      margin: 30px 0;
    }
    .box { 
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border: 1px solid #e2e8f0;
      padding: 25px;
      border-radius: 16px;
      position: relative;
    }
    .box::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 16px 16px 0 0;
    }
    .box-title {
      font-size: 16px;
      font-weight: 700;
      color: #4a5568;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #cbd5e0;
    }
    .row { 
      display: flex; 
      justify-content: space-between; 
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .row:last-child { border-bottom: none; }
    .label { 
      color: #718096; 
      font-size: 14px;
      font-weight: 600;
    }
    .value { 
      font-weight: 600;
      color: #2d3748;
      text-align: right;
      direction: ltr;
    }
    .amount { 
      font-size: 32px; 
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 900;
      text-align: right;
      letter-spacing: -1px;
    }
    .footer { 
      margin-top: 40px;
      padding-top: 25px;
      font-size: 14px;
      color: #718096;
      display: flex;
      justify-content: space-between;
      border-top: 2px solid #f7fafc;
      position: relative;
    }
    .footer::before {
      content: '';
      position: absolute;
      top: -2px; right: 0;
      width: 80px; height: 2px;
      background: linear-gradient(90deg, #764ba2, #667eea);
    }
    .company-name {
      font-weight: 700;
      font-size: 16px;
      color: #4a5568;
    }
    @media (max-width: 768px) {
      .card { padding: 25px 20px; border-radius: 16px; }
      .grid { grid-template-columns: 1fr; gap: 20px; }
      .header { flex-direction: column; gap: 15px; text-align: center; }
      .title { font-size: 24px; }
      .amount { font-size: 28px; }
      .footer { flex-direction: column; gap: 15px; text-align: center; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div>
          <div class="title">🧾 فاتورة إلكترونية</div>
          <div class="meta">
            📅 تاريخ الإنشاء: {{createdAt}}<br>
            🔖 رقم الفاتورة: #{{invoiceId}}
          </div>
        </div>
        <div style="text-align:left;">
          <div class="meta" style="margin-bottom: 10px;">💳 طريقة الدفع: {{paymentMethod}}</div>
          <div class="status-badge">{{status}}</div>
        </div>
      </div>
      
      <div class="grid">
        <div class="box">
          <div class="box-title">💰 تفاصيل المبلغ</div>
          <div class="row">
            <div class="label">المبلغ الإجمالي</div>
            <div class="amount">{{amount}} {{currency}}</div>
          </div>
          <div class="row">
            <div class="label">السبب</div>
            <div class="value">{{reason}}</div>
          </div>
          <div class="row">
            <div class="label">تاريخ الدفع</div>
            <div class="value">{{paymentDate}}</div>
          </div>
          <div class="row">
            <div class="label">معرّف الدفع</div>
            <div class="value">{{paymentIntentId}}</div>
          </div>
        </div>
        
        <div class="box">
          <div class="box-title">👤 بيانات العميل</div>
          <div class="row">
            <div class="label">الاسم الكامل</div>
            <div class="value">{{userName}}</div>
          </div>
          <div class="row">
            <div class="label">رقم الهاتف</div>
            <div class="value">{{userPhone}}</div>
          </div>
          <div class="row">
            <div class="label">العقار (عنوان المنشور)</div>
            <div class="value">{{postTitle}}</div>
          </div>
          <div class="row">
            <div class="label">بداية فترة الفوترة</div>
            <div class="value">{{billingPeriodStart}}</div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <div class="company-name">🏢 نظام الفواتير الإلكتروني</div>
        <div>
          <span>🤖</span>
          <span>ملاحظة: هذه الفاتورة تم توليدها تلقائياً</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

 
  private fillTemplate(data: Record<string, any>, fontPathToUse?: string) {
    const htmlWithFont = this.templateHtml.replace(
      /{{fontPath}}/g,
      fontPathToUse ? this.escapeHtml(fontPathToUse) : '',
    );

    let html = htmlWithFont;
 
    Object.keys(data || {}).forEach((k) => {
      const re = new RegExp(`{{${k}}}`, 'g');
      html = html.replace(re, this.escapeHtml(data[k]));
    });
 
    html = html.replace(/{{[^}]+}}/g, '');

    return html;
  }

  async generatePdf(payload: Record<string, any>): Promise<{ filename: string; filePath: string }> {
   
    const fontPath =
      (payload && payload.fontPath) || (fs.existsSync(this.DEFAULT_FONT_PATH) ? this.DEFAULT_FONT_PATH : null);
      const userUploadDir = path.join(process.cwd(), 'uploads', 'invoices', 'user');
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }
    const data = {
      invoiceId: payload.invoiceId ?? '',
      createdAt: payload.createdAt ?? '',
      amount: payload.amount ?? '',
      currency: payload.currency ?? '',
      reason: payload.reason ?? '',
      status: payload.status ?? '',
      paymentDate: payload.paymentDate ?? '',
      paymentIntentId: payload.paymentIntentId ?? '',
      userName: payload.userName ?? '',
      userPhone: payload.userPhone ?? '',
      postTitle: payload.postTitle ?? '',
      billingPeriodStart: payload.billingPeriodStart ?? '',
      paymentMethod: payload.paymentMethod ?? '',
    };

    let finalHtml = this.fillTemplate(data, fontPath);
 
    if (!fontPath) {
      finalHtml = finalHtml.replace(/@font-face\s*{[^}]*}/s, '');
      finalHtml = finalHtml.replace(/font-family:\s*'CairoCustom',\s*sans-serif;/g, "font-family: sans-serif;");
    }
 
    const filename = `invoice-${data.invoiceId || 'unknown'}-${Date.now()}.pdf`;
    const filePath = path.join(this.UPLOAD_DIR, filename);
 
    const chromeCandidates = [
      process.env.CHROME_PATH,
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/snap/bin/chromium',
    ].filter(Boolean) as string[];

    let executablePath: string | undefined;
    for (const p of chromeCandidates) {
      if (p && fs.existsSync(p)) {
        executablePath = p;
        break;
      }
    }

    if (!executablePath) {
      this.logger.warn(
        'لم أجد مسار Chrome تلقائياً. رجاء عرّف CHROME_PATH أو ثبت chrome/chromium. سأحاول بدء puppeteer بدون executablePath (قد يُحمّل Chromium تلقائياً إن استعملت puppeteer بدل puppeteer-core).',
      );
    }

      const launchOptions: puppeteer.LaunchOptions = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=ar-SA'],
    };

    if (executablePath) (launchOptions as any).executablePath = executablePath;

    let browser: puppeteer.Browser | null = null;
    try {
      browser = await puppeteer.launch(launchOptions);
      const page = await browser.newPage();

      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
 
      if (typeof (page as any).emulateMediaType === 'function') { 
        await (page as any).emulateMediaType('screen');
      }

      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      });

      this.logger.log(`PDF generated: ${filePath}`);
      return { filename, filePath };
    } catch (err) {
      this.logger.error('Error generating PDF', err);
      throw err;
    } finally {
      if (browser) {
        try { await browser.close(); } catch (e) { /* ignore */ }
      }
    }
  }
}