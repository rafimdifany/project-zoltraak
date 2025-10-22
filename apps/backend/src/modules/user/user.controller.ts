import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '../../lib/async-handler';
import { prisma } from '../../lib/prisma';
import type { UpdateCurrencyInput } from './user.schema';
import { UserService } from './user.service';

const userService = new UserService(prisma);

export const updateCurrencyHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const payload = req.body as UpdateCurrencyInput;

  const user = await userService.updateCurrency(userId, payload.currency);

  res.status(StatusCodes.OK).json({ user });
});
