import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '../../lib/async-handler';
import { prisma } from '../../lib/prisma';
import type { LoginInput, RegisterInput } from './auth.schema';
import { AuthService } from './auth.service';

const authService = new AuthService(prisma);

export const registerHandler = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register(req.body as RegisterInput);
  res.status(StatusCodes.CREATED).json({ user, tokens });
});

export const loginHandler = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.login(req.body as LoginInput);
  res.status(StatusCodes.OK).json({ user, tokens });
});
