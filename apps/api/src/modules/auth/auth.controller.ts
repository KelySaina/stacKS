import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const payload = await this.authService.register(dto);
    this.attachRefreshCookie(response, payload.refreshToken);
    return payload;
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const payload = await this.authService.login(dto, request.ip);
    this.attachRefreshCookie(response, payload.refreshToken);
    return payload;
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const payload = await this.authService.refresh(request.cookies?.refreshToken);
    this.attachRefreshCookie(response, payload.refreshToken);
    return payload;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: { id: string }) {
    return this.authService.me(user.id);
  }

  private attachRefreshCookie(response: Response, refreshToken: string) {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}