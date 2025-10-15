import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '../../lib/async-handler';
import { prisma } from '../../lib/prisma';
import type { CreateBudgetInput, UpdateBudgetInput } from './budget.schema';
import { BudgetService } from './budget.service';

const budgetService = new BudgetService(prisma);

export const listBudgetsHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const budgets = await budgetService.list(userId);
  res.status(StatusCodes.OK).json({ data: budgets });
});

export const createBudgetHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const budget = await budgetService.create(userId, req.body as CreateBudgetInput);
  res.status(StatusCodes.CREATED).json({ data: budget });
});

export const updateBudgetHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const budget = await budgetService.update(userId, req.params.id, req.body as UpdateBudgetInput);
  res.status(StatusCodes.OK).json({ data: budget });
});

export const deleteBudgetHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  await budgetService.remove(userId, req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});
