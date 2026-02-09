import { Auth } from '../entities/auth.entity';

export interface JwtPayload {
  subject: string;
  name: string;
  email: string;
}

export interface IAuthRepository {
  save(auth: Auth): Promise<void>;
  findByToken(token: string): Promise<Auth | null>;
  revokeToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>; // logout all sessions for a user
}