import { Prisma, type PrismaClient, type Transaction as TransactionModel } from '@prisma/client';

import type { Transaction as TransactionDto } from '@zoltraak/types';

import { AppError } from '../../lib/app-error';
import { ensureUserCurrency } from '../../lib/ensure-user-currency';
import type { CreateTransactionInput, UpdateTransactionInput } from './transaction.schema';

const serializeTransaction = (transaction: TransactionModel): TransactionDto => ({
  id: transaction.id,
  userId: transaction.userId,
  type: transaction.type,
  currency: transaction.currency ?? null,
  category: transaction.category,
  amount: transaction.amount.toNumber(),
  occurredAt: transaction.occurredAt.toISOString(),
  description: transaction.description,
  budgetId: transaction.budgetId,
  createdAt: transaction.createdAt.toISOString(),
  updatedAt: transaction.updatedAt.toISOString()
});

export class TransactionService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(userId: string): Promise<TransactionDto[]> {
    const records = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' }
    });
    return records.map(serializeTransaction);
  }

  async create(userId: string, input: CreateTransactionInput): Promise<TransactionDto> {
    const currency = await ensureUserCurrency(this.prisma, userId);

    const record = await this.prisma.transaction.create({
      data: {
        userId,
        type: input.type,
        currency,
        category: input.category,
        amount: new Prisma.Decimal(input.amount),
        occurredAt: input.occurredAt,
        description: input.description,
        budgetId: input.budgetId ?? undefined
      }
    });
    return serializeTransaction(record);
  }

  async update(userId: string, id: string, input: UpdateTransactionInput): Promise<TransactionDto> {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new AppError('Transaction not found', 404);
    }

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...(input.type && { type: input.type }),
        ...(input.category && { category: input.category }),
        ...(input.amount && { amount: new Prisma.Decimal(input.amount) }),
        ...(input.occurredAt && { occurredAt: input.occurredAt }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.budgetId !== undefined && { budgetId: input.budgetId ?? null })
      }
    });

    return serializeTransaction(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new AppError('Transaction not found', 404);
    }

    await this.prisma.transaction.delete({ where: { id } });
  }
}
