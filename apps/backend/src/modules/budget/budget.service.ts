import { Prisma, type Budget as BudgetModel, type PrismaClient } from '@prisma/client';

import type { Budget as BudgetDto } from '@zoltraak/types';
import { AppError } from '../../lib/app-error';
import { ensureUserCurrency } from '../../lib/ensure-user-currency';
import type { CreateBudgetInput, UpdateBudgetInput } from './budget.schema';

export class BudgetService {
  constructor(private readonly prisma: PrismaClient) {}

  private serialize(budget: BudgetModel): BudgetDto {
    return {
      id: budget.id,
      userId: budget.userId,
      name: budget.name,
      targetAmount: budget.targetAmount.toNumber(),
      periodStart: budget.periodStart.toISOString(),
      periodEnd: budget.periodEnd.toISOString(),
      createdAt: budget.createdAt.toISOString(),
      updatedAt: budget.updatedAt.toISOString()
    };
  }

  async list(userId: string): Promise<BudgetDto[]> {
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
      orderBy: { periodStart: 'desc' }
    });

    return budgets.map((budget) => this.serialize(budget));
  }

  async create(userId: string, input: CreateBudgetInput): Promise<BudgetDto> {
    await ensureUserCurrency(this.prisma, userId);

    const budget = await this.prisma.budget.create({
      data: {
        userId,
        name: input.name,
        targetAmount: new Prisma.Decimal(input.targetAmount),
        periodStart: input.periodStart,
        periodEnd: input.periodEnd
      }
    });

    return this.serialize(budget);
  }

  async update(userId: string, id: string, input: UpdateBudgetInput): Promise<BudgetDto> {
    const existing = await this.prisma.budget.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new AppError('Budget not found', 404);
    }

    const updated = await this.prisma.budget.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.targetAmount && { targetAmount: new Prisma.Decimal(input.targetAmount) }),
        ...(input.periodStart && { periodStart: input.periodStart }),
        ...(input.periodEnd && { periodEnd: input.periodEnd })
      }
    });

    return this.serialize(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.budget.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new AppError('Budget not found', 404);
    }

    await this.prisma.budget.delete({ where: { id } });
  }
}
