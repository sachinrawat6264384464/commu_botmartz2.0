import nodemailer, { Transporter } from 'nodemailer';
import { adminDb } from '@/lib/firebase-admin';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailProvider {
  sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
  verifyConnection(): Promise<boolean>;
}

export class HostingerSmtpProvider implements EmailProvider {
  private transporter: Transporter | null = null;
  private defaultFrom: string = '';

  private async getTransporter(): Promise<{ transporter: Transporter; fromEmail: string } | null> {
    let settings: any = {};
    try {
      if (adminDb) {
        const settingsSnap = await adminDb.collection('settings').doc('global').get();
        if (settingsSnap.exists) {
          settings = settingsSnap.data();
        }
      }
    } catch (e) {
      console.warn('[HostingerSmtpProvider] Could not fetch DB settings, falling back to ENV:', e);
    }

    const host = settings?.email?.smtpHost || process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = Number(settings?.email?.smtpPort || process.env.SMTP_PORT || 465);
    const user = settings?.email?.smtpUser || process.env.SMTP_USER || 'team@botmartz.com';
    const pass = settings?.email?.smtpPass || process.env.SMTP_PASS || '4ahz-gtmt-1tyv-zbfz';
    const fromName = settings?.email?.fromName || process.env.EMAIL_FROM_NAME || 'Botmartz Community';
    const fromEmail = settings?.email?.fromEmail || user || 'team@botmartz.com';

    if (!user || !pass) {
      console.error('[HostingerSmtpProvider] SMTP credentials missing');
      return null;
    }

    this.defaultFrom = `"${fromName}" <${fromEmail}>`;

    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 8000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
      });
    }

    return { transporter: this.transporter, fromEmail: this.defaultFrom };
  }

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const smtp = await this.getTransporter();
      if (!smtp) {
        return {
          success: false,
          error: 'SMTP transporter not configured or credentials missing.',
        };
      }

      const mailOptions = {
        from: options.from || smtp.fromEmail,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>?/gm, ''),
        replyTo: options.replyTo || process.env.EMAIL_REPLY_TO || 'team@botmartz.com',
        headers: options.headers || {},
      };

      try {
        const info = await smtp.transporter.sendMail(mailOptions);
        console.log(`[HostingerSmtpProvider] Email sent to ${options.to}. MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
      } catch (primaryErr: any) {
        console.warn('[HostingerSmtpProvider] Primary SMTP transport failed, attempting fallback port 587:', primaryErr?.message);
        
        // Fallback transporter using Port 587 with STARTTLS
        const fallbackTransporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.hostinger.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER || 'team@botmartz.com',
            pass: process.env.SMTP_PASS || '4ahz-gtmt-1tyv-zbfz',
          },
          tls: { rejectUnauthorized: false },
          connectionTimeout: 8000,
          greetingTimeout: 5000,
          socketTimeout: 10000,
        });

        const fallbackInfo = await fallbackTransporter.sendMail(mailOptions);
        console.log(`[HostingerSmtpProvider] Email sent via fallback port 587 to ${options.to}. MessageId: ${fallbackInfo.messageId}`);
        return { success: true, messageId: fallbackInfo.messageId };
      }
    } catch (err: any) {
      console.error('[HostingerSmtpProvider] Send email failed on all transports:', err);
      return {
        success: false,
        error: err.message || 'Unknown SMTP send failure',
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      const smtp = await this.getTransporter();
      if (!smtp) return false;
      await smtp.transporter.verify();
      return true;
    } catch (err) {
      console.error('[HostingerSmtpProvider] Connection verification failed:', err);
      return false;
    }
  }
}

export const emailProvider = new HostingerSmtpProvider();
