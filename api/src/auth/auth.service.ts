import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Auth } from './entities/auth.entity';
import { InMemoryAuthRepository } from './repository/auth.repository';
import { ulid } from 'ulid';
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: InMemoryAuthRepository,
    private readonly userRepository: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { subject: user.id };
    const refreshToken = this.jwtService.sign(payload, { 
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '1d'
    });

    await this.authRepository.save(new Auth({
    id: ulid(),
    userId: user.id,
    refreshToken: refreshToken, // need to use bcrypt hash
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    isRevoked: false
  }));

    return {
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      }),
      refreshToken: refreshToken,
    };
  }

  async refresh(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_REFRESH_SECRET });

      const storedToken = await this.authRepository.findByToken(token);
      if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Revoke the old refresh token
      await this.authRepository.revokeToken(token);

      const newRefreshToken = this.jwtService.sign(payload, { 
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '1d'
      });

      await this.authRepository.save(new Auth({
        id: ulid(),
        userId: payload.subject,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        isRevoked: false
      }));

      return {
        accessToken: this.jwtService.sign(
          { subject: payload.subject },
          { 
            expiresIn: '15m',
            secret: process.env.JWT_SECRET,
          },
        ),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
