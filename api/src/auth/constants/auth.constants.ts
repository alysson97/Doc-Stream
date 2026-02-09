import { SetMetadata } from "@nestjs/common";

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'default-secret-key', // access token secret
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): ReturnType<typeof SetMetadata> => SetMetadata(IS_PUBLIC_KEY, true);