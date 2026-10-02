import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapClient } from 'mailtrap';
import { API_VERSION } from '../common/constants/api-version.js';
import { EmailTemplateRendererService } from './email-template-renderer.service.js';

interface SendTokenEmailParams {
  name: string;
  token: string;
  expiresAt: Date;
}

@Injectable()
export class EmailService {
  private mailtrap: MailtrapClient;
  private from: { name: string; email: string };
  private appUrl: string;

  constructor(
    private configService: ConfigService,
    private emailTemplateRenderer: EmailTemplateRendererService,
  ) {
    const sandbox =
      this.configService.get<string>('MAILTRAP_SANDBOX') === 'true';

    this.mailtrap = new MailtrapClient({
      token: this.configService.getOrThrow<string>('MAILTRAP_API_KEY'),
      sandbox,
      ...(sandbox && {
        testInboxId: Number(
          this.configService.getOrThrow<string>('MAILTRAP_TEST_INBOX_ID'),
        ),
      }),
    });
    this.from = {
      name: this.configService.getOrThrow<string>('EMAIL_FROM_NAME'),
      email: this.configService.getOrThrow<string>('EMAIL_FROM_ADDRESS'),
    };
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
    const email = await this.emailTemplateRenderer.renderVerificationEmail({
      name,
      url: this.buildUrl(`/api/v${API_VERSION}/auth/verify-email`, token),
      expiresIn: this.formatExpiry(expiresAt),
    });

    return this.send(to, email);
  }

  async sendPasswordResetEmail(
    to: string,
    { name, token, expiresAt }: SendTokenEmailParams,
  ) {
    const email = await this.emailTemplateRenderer.renderPasswordResetEmail({
      name,
      url: this.buildUrl(`/api/v${API_VERSION}/auth/reset-password`, token),
      expiresIn: this.formatExpiry(expiresAt),
    });

    return this.send(to, email);
  }

  private async send(
    to: string,
    {
      subject,
      html,
      text,
    }: {
      subject: string;
      html: string;
      text: string;
    },
  ) {
    return this.mailtrap.send({
      from: this.from,
      to: [{ email: to }],
      subject,
      html,
      text,
    });
  }
}
