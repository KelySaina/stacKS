import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (exists) {
      throw new BadRequestException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    if (dto.tenantId) {
      await this.prisma.tenantUser.create({
        data: {
          tenantId: dto.tenantId,
          userId: user.id,
          role: Role.VIEWER,
        },
      });
    }

    return this.getAuthPayload(user.id);
  }

  async login(dto: LoginDto, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = await this.getAuthPayload(user.id);

    if (payload.tenants[0]) {
      await this.auditService.log({
        action: 'LOGIN',
        resource: 'auth',
        userId: user.id,
        tenantId: payload.tenants[0].tenant.id,
        ipAddress,
        details: { email: user.email },
      });
    }

    return payload;
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return this.getAuthPayload(payload.sub);
  }

  async me(userId: string) {
    return this.getAuthPayload(userId);
  }

  async getAuthPayload(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        tenants: {
          include: {
            tenant: true,
          },
        },
      },
    });

    const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as StringValue;
    const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as StringValue;

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: accessExpiresIn,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: refreshExpiresIn,
      },
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isSuperAdmin: user.isSuperAdmin,
      },
      tenants: user.tenants,
      accessToken,
      refreshToken,
    };
  }
}