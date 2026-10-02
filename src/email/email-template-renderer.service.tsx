import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import {
  ResetPasswordEmail,
  resetPasswordEmailText,
} from './emails/reset-password-email.js';
import { VerifyEmail, verifyEmailText } from './emails/verify-email.js';

interface TokenEmailTemplateProps {
  name: string;
  url: string;
  expiresIn: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class EmailTemplateRendererService {
  async renderVerificationEmail({
    name,
    url,
    expiresIn,
  }: TokenEmailTemplateProps): Promise<RenderedEmail> {
    const props = { name, verifyUrl: url, expiresIn };

    return {
      subject: 'Xác nhận địa chỉ email của bạn',
      html: await render(<VerifyEmail {...props} />),
      text: verifyEmailText(props),
    };
  }

  async renderPasswordResetEmail({
    name,
    url,
    expiresIn,
  }: TokenEmailTemplateProps): Promise<RenderedEmail> {
    const props = { name, resetUrl: url, expiresIn };

    return {
      subject: 'Đặt lại mật khẩu',
      html: await render(<ResetPasswordEmail {...props} />),
      text: resetPasswordEmailText(props),
    };
  }
}
