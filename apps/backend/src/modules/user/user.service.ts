import type { CurrencyCode, PrismaClient, User } from '@prisma/client';

import { AppError } from '../../lib/app-error';

type SanitizedUser = Omit<User, 'passwordHash'>;

const sanitizeUser = (user: User): SanitizedUser => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
};

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async updateCurrency(userId: string, currency: CurrencyCode): Promise<SanitizedUser> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.user.findUnique({ where: { id: userId } });

      if (!existing) {
        throw new AppError('User not found', 404);
      }

      if (existing.currency && existing.currency !== currency) {
        await tx.transaction.deleteMany({ where: { userId } });
      }

      if (existing.currency === currency) {
        return sanitizeUser(existing);
      }

      const updated = await tx.user.update({
        where: { id: userId },
        data: { currency }
      });

      return sanitizeUser(updated);
    });
  }
}
