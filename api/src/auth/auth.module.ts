import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './../users/users.module';
import { InMemoryAuthRepository } from './repository/auth.repository';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt-secret',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, InMemoryAuthRepository],
})
export class AuthModule {}
