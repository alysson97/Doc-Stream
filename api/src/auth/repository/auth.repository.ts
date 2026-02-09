import { Injectable } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { IAuthRepository } from './../interfaces/auth.interfaces';

@Injectable()
export class InMemoryAuthRepository implements IAuthRepository {
  private tokens: Auth[] = [];

  async save(auth: Auth): Promise<void> {
    this.tokens.push(auth);
  }

  async findByToken(token: string): Promise<Auth | null> {
    return this.tokens.find(t => t.refreshToken === token && !t.isRevoked) || null;
  }

  async revokeToken(token: string): Promise<void> {
    const auth = this.tokens.find(t => t.refreshToken === token);
    if (auth) auth.isRevoked = true;
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.tokens = this.tokens.filter(t => t.userId !== userId);
  }
}
