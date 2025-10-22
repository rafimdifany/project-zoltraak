import type { PrismaClient } from '@prisma/client';

import { AppError } from './app-error';

export const ensureUserCurrency = async (prisma: PrismaClient, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currency: true }
  });

  if (!user?.currency) {
    throw new AppError('Please set your currency before performing this action.', 409);
  }

  return user.currency;
};
