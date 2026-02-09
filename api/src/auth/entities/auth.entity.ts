export class Auth {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;

  constructor(partial: Partial<Auth>) {
    Object.assign(this, partial);
  }
}
