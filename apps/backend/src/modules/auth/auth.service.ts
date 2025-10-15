import type { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

import { env } from '../../config/env';
import { AppError } from '../../lib/app-error';
import type { LoginInput, RegisterInput } from './auth.schema';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type SanitizedUser = Omit<User, 'passwordHash'>;

export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(input: RegisterInput): Promise<{ user: SanitizedUser; tokens: AuthTokens }> {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        displayName: input.displayName ?? null,
        passwordHash
      }
    });

    const tokens = this.createTokens(user);

    return { user: this.sanitizeUser(user), tokens };
  }

  async login(input: LoginInput): Promise<{ user: SanitizedUser; tokens: AuthTokens }> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });

    if (!user || !user.passwordHash) {
      throw new AppError('Invalid credentials', 401);
    }

    const passwordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = this.createTokens(user);

    return { user: this.sanitizeUser(user), tokens };
  }

  private sanitizeUser(user: User): SanitizedUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }

  private createTokens(user: User): AuthTokens {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessTokenOptions: SignOptions = {
      expiresIn: env.ACCESS_TOKEN_TTL as StringValue
    };
    const refreshTokenOptions: SignOptions = {
      expiresIn: env.REFRESH_TOKEN_TTL as StringValue
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, accessTokenOptions);
    const refreshToken = jwt.sign(payload, env.JWT_SECRET, refreshTokenOptions);

    return { accessToken, refreshToken };
  }
}
