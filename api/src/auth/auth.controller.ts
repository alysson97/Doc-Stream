import { Controller, Post, Body, Res, HttpCode, HttpStatus, Req, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Login } from './dto/login.dto';
import { Public } from './constants/auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() auth: Login, @Res({ passthrough: true }) res: Response) {
    const loginValidation = await this.authService.login(auth.email, auth.password);

    res.cookie('refreshToken', loginValidation.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // one day
    });
    return {
      name: loginValidation.username,
      email: loginValidation.email,
      role: loginValidation.role,
      accessToken: loginValidation.accessToken,
    };
  }

  @Public()
  @Post('refresh')
  refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');
    return this.authService.refresh(refreshToken);
  }
}
