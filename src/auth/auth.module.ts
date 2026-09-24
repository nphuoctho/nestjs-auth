import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [UsersModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
