import { Module } from '@nestjs/common';
import { EmailTemplateRendererService } from './email-template-renderer.service.js';
import { EmailService } from './email.service.js';

@Module({
  providers: [EmailService, EmailTemplateRendererService],
  exports: [EmailService],
})
export class EmailModule {}
