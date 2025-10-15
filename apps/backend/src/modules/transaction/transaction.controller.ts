import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '../../lib/async-handler';
import { prisma } from '../../lib/prisma';
import type { CreateTransactionInput, UpdateTransactionInput } from './transaction.schema';
import { TransactionService } from './transaction.service';

const transactionService = new TransactionService(prisma);

export const listTransactionsHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const transactions = await transactionService.list(userId);
  res.status(StatusCodes.OK).json({ data: transactions });
});

export const createTransactionHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const transaction = await transactionService.create(userId, req.body as CreateTransactionInput);
  res.status(StatusCodes.CREATED).json({ data: transaction });
});

export const updateTransactionHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const transaction = await transactionService.update(
    userId,
    req.params.id,
    req.body as UpdateTransactionInput
  );
  res.status(StatusCodes.OK).json({ data: transaction });
});

export const deleteTransactionHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  await transactionService.remove(userId, req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});
