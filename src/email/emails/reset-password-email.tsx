import { Link, Text } from 'react-email';
import {
  EmailButton,
  EmailLayout,
  linkStyle,
  textStyle,
} from './email-layout.js';

export interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
  expiresIn: string;
}

export function ResetPasswordEmail({
  name,
  resetUrl,
  expiresIn,
}: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Đặt lại mật khẩu của bạn" heading="Đặt lại mật khẩu">
      <Text style={textStyle}>Xin chào {name},</Text>
      <Text style={textStyle}>
        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn
        nút bên dưới để chọn mật khẩu mới. Link có hiệu lực trong {expiresIn}.
      </Text>
      <EmailButton href={resetUrl} label="Đặt lại mật khẩu" />
      <Text style={textStyle}>
        Hoặc copy link này vào trình duyệt:
        <br />
        <Link href={resetUrl} style={linkStyle}>
          {resetUrl}
        </Link>
      </Text>
    </EmailLayout>
  );
}

// Default export with sample props for `email dev` preview server.
export default function ResetPasswordEmailPreview() {
  return (
    <ResetPasswordEmail
      name="Tho"
      resetUrl="http://localhost:3999/api/auth/reset-password?token=sample-token"
      expiresIn="15 phút"
    />
  );
}

export function resetPasswordEmailText({
  name,
  resetUrl,
  expiresIn,
}: ResetPasswordEmailProps): string {
  return [
    `Xin chào ${name},`,
    '',
    `Đặt lại mật khẩu bằng link sau (hiệu lực ${expiresIn}):`,
    resetUrl,
    '',
    'Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.',
  ].join('\n');
}
