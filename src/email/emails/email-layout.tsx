import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'react-email';
import type { PropsWithChildren } from 'react';

interface EmailLayoutProps {
  preview: string;
  heading: string;
}

const brandColor = '#4f46e5';

export function EmailLayout({
  preview,
  heading,
  children,
}: PropsWithChildren<EmailLayoutProps>) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={logo}>NestJS Auth</Heading>
          <Heading as="h2" style={title}>
            {heading}
          </Heading>
          <Section>{children}</Section>
          <Text style={footer}>
            Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Bulletproof button: Outlook (Word engine) ignores `border-radius`, so it gets
 * a VML `<v:roundrect>` with `arcsize`; every other client gets the plain <a>.
 * `width`/`height` must be fixed because VML cannot size to its content.
 */
export function EmailButton({
  href,
  label,
  width = 240,
  height = 48,
}: {
  href: string;
  label: string;
  width?: number;
  height?: number;
}) {
  const [safeHref, safeLabel] = [href, label].map((value) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;'),
  );
  const arcsize = Math.round((6 / height) * 100);

  const html = `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeHref}" style="height:${height}px;v-text-anchor:middle;width:${width}px;" arcsize="${arcsize}%" stroke="f" fillcolor="${brandColor}">
  <w:anchorlock/>
  <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:600;">${safeLabel}</center>
</v:roundrect>
<![endif]--><!--[if !mso]><!--><a href="${safeHref}" style="background-color:${brandColor};border-radius:6px;color:#ffffff;display:inline-block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;font-weight:600;line-height:${height}px;text-align:center;text-decoration:none;width:${width}px;">${safeLabel}</a><!--<![endif]-->`;

  return (
    <Section style={{ textAlign: 'center', margin: '32px 0' }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Section>
  );
}

export const textStyle: React.CSSProperties = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
};

export const linkStyle: React.CSSProperties = {
  color: brandColor,
  fontSize: '13px',
  wordBreak: 'break-all',
};

const body: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  // Outlook (Word engine) drops border-radius: the card renders square there.
  // Accepted degradation — a VML rounded background would break the fluid
  // max-width and force a fixed pixel height on the whole card.
  borderRadius: '8px',
  margin: '40px auto',
  padding: '32px',
  maxWidth: '480px',
};

const logo: React.CSSProperties = {
  color: brandColor,
  fontSize: '20px',
  textAlign: 'center',
};

const title: React.CSSProperties = {
  color: '#111827',
  fontSize: '22px',
  textAlign: 'center',
};

const footer: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  marginTop: '32px',
  textAlign: 'center',
};
