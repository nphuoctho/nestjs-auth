import { EmailTemplateRendererService } from './email-template-renderer.service.js';

describe('EmailTemplateRendererService', () => {
  const renderer = new EmailTemplateRendererService();

  it('renders a verification email as HTML and plain text', async () => {
    const email = await renderer.renderVerificationEmail({
      name: 'Nguyen Van A',
      url: 'https://app.example.com/verify?token=verification-token',
      expiresIn: '24 giờ',
    });

    expect(email.subject).toBe('Xác nhận địa chỉ email của bạn');
    expect(email.html).toContain('Xác nhận email');
    expect(email.html).toContain('verification-token');
    expect(email.text).toContain('Nguyen Van A');
    expect(email.text).toContain('24 giờ');
  });

  it('renders a password reset email as HTML and plain text', async () => {
    const email = await renderer.renderPasswordResetEmail({
      name: 'Nguyen Van A',
      url: 'https://app.example.com/reset-password?token=reset-token',
      expiresIn: '45 phút',
    });

    expect(email.subject).toBe('Đặt lại mật khẩu');
    expect(email.html).toContain('Đặt lại mật khẩu');
    expect(email.html).toContain('reset-token');
    expect(email.text).toContain('Nguyen Van A');
    expect(email.text).toContain('45 phút');
  });
});
