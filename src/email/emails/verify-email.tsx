import { Link, Text } from 'react-email';
import {
  EmailButton,
  EmailLayout,
  linkStyle,
  textStyle,
} from './email-layout.js';

export interface VerifyEmailProps {
  name: string;
  verifyUrl: string;
  expiresIn: string;
}

export function VerifyEmail({ name, verifyUrl, expiresIn }: VerifyEmailProps) {
  return (
    <EmailLayout
      preview="Xác nhận địa chỉ email của bạn"
      heading="Xác nhận email"
    >
      <Text style={textStyle}>Xin chào {name},</Text>
      <Text style={textStyle}>
        Cảm ơn bạn đã đăng ký. Nhấn nút bên dưới để xác nhận địa chỉ email. Link
        có hiệu lực trong {expiresIn}.
      </Text>
      <EmailButton href={verifyUrl} label="Xác nhận email" />
      <Text style={textStyle}>
        Hoặc copy link này vào trình duyệt:
        <br />
        <Link href={verifyUrl} style={linkStyle}>
          {verifyUrl}
        </Link>
      </Text>
    </EmailLayout>
  );
}

// Default export with sample props for `email dev` preview server.
export default function VerifyEmailPreview() {
  return (
    <VerifyEmail
      name="Tho"
      verifyUrl="http://localhost:3999/api/auth/verify-email?token=sample-token"
      expiresIn="24 giờ"
    />
  );
}

export function verifyEmailText({
  name,
  verifyUrl,
  expiresIn,
}: VerifyEmailProps): string {
  return [
    `Xin chào ${name},`,
    '',
    `Xác nhận email của bạn bằng link sau (hiệu lực ${expiresIn}):`,
    verifyUrl,
    '',
    'Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.',
  ].join('\n');
}
