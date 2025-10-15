import type { PrismaClient, Transaction } from '@prisma/client';

import type { DashboardQuery } from './dashboard.schema';

const decimalToNumber = (value: { toNumber(): number } | null | undefined) =>
  value ? value.toNumber() : 0;

export class DashboardService {
  constructor(private readonly prisma: PrismaClient) {}

  async overview(userId: string, query: DashboardQuery) {
    const dateFilter =
      query.from || query.to
        ? {
            occurredAt: {
              ...(query.from && { gte: query.from }),
              ...(query.to && { lte: query.to })
            }
          }
        : undefined;

    const where = {
      userId,
      ...(dateFilter ?? {})
    };

    const [incomeAgg, expenseAgg, recentTransactions, budgets, assets, assetsAgg] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          type: 'INCOME'
        },
        _sum: { amount: true }
      }),
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          type: 'EXPENSE'
        },
        _sum: { amount: true }
      }),
      this.prisma.transaction.findMany({
        where,
        orderBy: { occurredAt: 'desc' },
        take: 5
      }),
      this.prisma.budget.findMany({
        where: { userId },
        orderBy: { periodStart: 'desc' }
      }),
      this.prisma.asset.findMany({
        where: { userId },
        orderBy: { currentValue: 'desc' }
      }),
      this.prisma.asset.aggregate({
        where: { userId },
        _sum: { currentValue: true }
      })
    ]);

    const formatTransactions = (items: Transaction[]) =>
      items.map((item) => ({
        id: item.id,
        type: item.type,
        category: item.category,
        amount: item.amount.toNumber(),
        occurredAt: item.occurredAt.toISOString(),
        description: item.description
      }));

    const income = decimalToNumber(incomeAgg._sum.amount);
    const expense = decimalToNumber(expenseAgg._sum.amount);
    const assetsTotal = decimalToNumber(assetsAgg._sum.currentValue);

    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const spentAgg = await this.prisma.transaction.aggregate({
          where: {
            userId,
            budgetId: budget.id,
            type: 'EXPENSE'
          },
          _sum: { amount: true }
        });

        return {
          id: budget.id,
          userId: budget.userId,
          name: budget.name,
          targetAmount: budget.targetAmount.toNumber(),
          periodStart: budget.periodStart.toISOString(),
          periodEnd: budget.periodEnd.toISOString(),
          createdAt: budget.createdAt.toISOString(),
          updatedAt: budget.updatedAt.toISOString(),
          spent: decimalToNumber(spentAgg._sum.amount)
        };
      })
    );

    return {
      totals: {
        income,
        expense,
        net: income - expense,
        assets: assetsTotal
      },
      recentTransactions: formatTransactions(recentTransactions),
      budgets: budgetsWithProgress,
      assets: assets.map((asset) => ({
        id: asset.id,
        userId: asset.userId,
        name: asset.name,
        category: asset.category,
        currentValue: asset.currentValue.toNumber(),
        createdAt: asset.createdAt.toISOString(),
        updatedAt: asset.updatedAt.toISOString()
      }))
    };
  }
}
