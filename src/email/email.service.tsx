import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import {
  ResetPasswordEmail,
  resetPasswordEmailText,
} from './emails/reset-password-email.js';
import { VerifyEmail, verifyEmailText } from './emails/verify-email.js';

interface SendTokenEmailParams {
  name: string;
  token: string;
  expiresAt: Date;
}

@Injectable()
export class EmailService {
  private resend: Resend;
  private from: string;
  private appUrl: string;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
    this.from =
      this.configService.get<string>('EMAIL_FROM') ??
      'NestJS Auth <onboarding@resend.dev>';
    this.appUrl = this.configService.getOrThrow<string>('APP_URL');
  }

  private buildUrl(path: string, token: string): string {
    const url = new URL(path, this.appUrl);
    url.searchParams.set('token', token);
    return url.toString();
  }

  /** "45 phút" / "24 giờ" / "3 ngày" — whole units only, rounded up. */
  private formatExpiry(expiresAt: Date): string {
    const minutes = Math.max(
      1,
      Math.ceil((expiresAt.getTime() - Date.now()) / 60_000),
    );
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.round(minutes / 60);
    if (hours < 48) return `${hours} giờ`;
    return `${Math.round(hours / 24)} ngày`;
  }

  async sendVerificationEmail(
    to: string,
    { name, token, expiresAt }: SendTokenEmailParams,
  ) {
    const props = {
      name,
      verifyUrl: this.buildUrl('/api/auth/verify-email', token),
      expiresIn: this.formatExpiry(expiresAt),
    };

    return this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Xác nhận địa chỉ email của bạn',
      html: await render(<VerifyEmail {...props} />),
      text: verifyEmailText(props),
    });
  }

  async sendPasswordResetEmail(
    to: string,
    { name, token, expiresAt }: SendTokenEmailParams,
  ) {
    const props = {
      name,
      resetUrl: this.buildUrl('/api/auth/reset-password', token),
      expiresIn: this.formatExpiry(expiresAt),
    };

    return this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Đặt lại mật khẩu',
      html: await render(<ResetPasswordEmail {...props} />),
      text: resetPasswordEmailText(props),
    });
  }
}
