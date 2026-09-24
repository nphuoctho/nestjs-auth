import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service.js';
import { RegisterDto } from './dto/register.dto.js';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto.js';
import { Response } from 'express';
import { User } from '../db/schema.js';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (existingUser)
      throw new ConflictException('An account with this email already exists');

    const passwordHash = await argon2.hash(dto.password);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    const user = await this.userService.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      verificationToken,
      verificationTokenExpiresAt,
    });

    await this.emailService.sendVerificationEmail(user.email, {
      name: user.name,
      token: verificationToken,
      expiresAt: verificationTokenExpiresAt,
    });

    return {
      message:
        'Registration Successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string, res: Response) {
    const user = await this.userService.findByVerifycationToken(token);

    if (!user || !user?.verificationToken)
      throw new BadRequestException('Invalid verifycation token');

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    )
      throw new BadRequestException(
        'Verification token has expired. Please request a new on',
      );

    await this.userService.update(user.id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
    });

    const tokens = await this.generateToken(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      message: 'Email verified successfully. You are now logged in',
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordMatch = await argon2.verify(user.passwordHash, dto.password);

    if (!passwordMatch)
      throw new UnauthorizedException('Invalid email or password');

    if (!user.isVerified)
      throw new UnauthorizedException('Please verify your email before login');

    const tokens = await this.generateToken(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string, res: Response) {
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token provided');

    let payload: { sub: string; email: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userService.findById(payload.sub);

    if (!user || !user.refreshTokenHash)
      throw new UnauthorizedException('Invalid refresh token');

    const tokenMatch = await argon2.verify(refreshToken, user.refreshTokenHash);

    if (!tokenMatch) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.generateToken(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
    };
  }

  async logout(userId: string, res: Response) {
    await this.userService.update(userId, {
      refreshTokenHash: null,
    });

    res.clearCookie('refresh_token');

    return {
      message: 'Logout successfully',
    };
  }

  private async generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.userService.update(userId, { refreshTokenHash });
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
