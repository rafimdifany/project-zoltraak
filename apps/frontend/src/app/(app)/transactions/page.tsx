'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, Loader2, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBudgets } from '@/hooks/use-budgets';
import { useCategories } from '@/hooks/use-categories';
import { useCurrencyFormatter } from '@/hooks/use-currency';
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction
} from '@/hooks/use-transactions';
import { getErrorMessage } from '@/lib/http-error';
import type { Category, Transaction } from '@zoltraak/types';

const transactionFormSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  occurredAt: z.string().min(1, 'Date is required'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  budgetId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal(''))
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const createDefaultValues = (): TransactionFormValues => ({
  type: 'EXPENSE',
  category: '',
  amount: 0,
  occurredAt: new Date().toISOString().slice(0, 10),
  description: '',
  budgetId: ''
});

export default function TransactionsPage() {
  const transactionsQuery = useTransactions();
  const budgetsQuery = useBudgets();
  const categoriesQuery = useCategories();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const { format: formatCurrency } = useCurrencyFormatter();

  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
  const categoryOptionsByType = useMemo(() => {
    const options: Record<'INCOME' | 'EXPENSE', { value: string; label: string }[]> = {
      INCOME: [],
      EXPENSE: []
    };

    const traverse = (nodes: Category[], prefix?: string) => {
      nodes.forEach((node) => {
        const label = prefix ? `${prefix} / ${node.name}` : node.name;
        options[node.type].push({ value: label, label });

        if (node.subcategories.length) {
          traverse(node.subcategories, label);
        }
      });
    };

    traverse(categories);
    return options;
  }, [categories]);

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: createDefaultValues()
  });

  const selectedTransactionType = watch('type') ?? 'EXPENSE';

  const categoryOptionsWithFallback = useMemo(() => {
    const baseOptions = categoryOptionsByType[selectedTransactionType] ?? [];

    if (!editingTransaction || !editingTransaction.category) {
      return baseOptions;
    }

    const exists = baseOptions.some(
      (option) => option.value === editingTransaction.category
    );

    if (exists) {
      return baseOptions;
    }

    return [
      ...baseOptions,
      { value: editingTransaction.category, label: editingTransaction.category }
    ];
  }, [categoryOptionsByType, editingTransaction, selectedTransactionType]);

  const budgets = useMemo(() => budgetsQuery.data ?? [], [budgetsQuery.data]);
  const budgetLookup = useMemo(() => new Map(budgets.map((budget) => [budget.id, budget.name])), [budgets]);

  const isSubmitting = createTransaction.isPending || updateTransaction.isPending;

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActionError(null);
    reset({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      occurredAt: transaction.occurredAt.slice(0, 10),
      description: transaction.description ?? '',
      budgetId: transaction.budgetId ?? ''
    });
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setActionError(null);
    reset(createDefaultValues());
  };

  const handleDelete = async (transaction: Transaction) => {
    const confirmed = window.confirm('Delete this transaction? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setActionError(null);
    setDeletingId(transaction.id);

    try {
      await deleteTransaction.mutateAsync(transaction.id);
      if (editingTransaction?.id === transaction.id) {
        handleCancelEdit();
      }
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to delete the transaction. Please try again.'));
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setActionError(null);

    const formattedPayload = {
      type: values.type,
      category: values.category,
      amount: values.amount,
      occurredAt: new Date(values.occurredAt).toISOString(),
      description: values.description?.trim() ? values.description.trim() : undefined,
      budgetId: values.budgetId ? values.budgetId : null
    };

    try {
      if (editingTransaction) {
        await updateTransaction.mutateAsync({
          id: editingTransaction.id,
          payload: formattedPayload
        });
        handleCancelEdit();
      } else {
        await createTransaction.mutateAsync(formattedPayload);
        reset(createDefaultValues());
      }
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to save the transaction. Please try again.'));
    }
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Record every income and expense to keep your cashflow accurate.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editingTransaction ? 'Edit transaction' : 'Add a new transaction'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register('type')}
                  >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    {...register('category')}
                    disabled={categoriesQuery.isLoading}
                  >
                    <option value="">Select a category</option>
                    {categoryOptionsWithFallback.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.category ? (
                    <p className="text-xs text-rose-500">{errors.category.message}</p>
                  ) : categoriesQuery.isLoading ? (
                    <p className="text-xs text-muted-foreground">Loading categories...</p>
                  ) : categoryOptionsWithFallback.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Create categories under Categories to make selection easier.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Select a {selectedTransactionType === 'INCOME' ? 'income' : 'expense'} category or subcategory from your library.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register('amount')}
                  />
                  {errors.amount ? <p className="text-xs text-rose-500">{errors.amount.message}</p> : null}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="occurredAt">Date</Label>
                  <Input id="occurredAt" type="date" {...register('occurredAt')} />
                  {errors.occurredAt ? (
                    <p className="text-xs text-rose-500">{errors.occurredAt.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="budgetId">Budget (optional)</Label>
                  <select
                    id="budgetId"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register('budgetId')}
                  >
                    <option value="">No budget</option>
                    {budgets.map((budget) => (
                      <option key={budget.id} value={budget.id}>
                        {budget.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Optional details"
                    {...register('description')}
                  />
                  {errors.description ? (
                    <p className="text-xs text-rose-500">{errors.description.message}</p>
                  ) : null}
                </div>
              </div>

              {actionError ? <p className="text-sm text-rose-500">{actionError}</p> : null}

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingTransaction ? 'Save changes' : 'Add transaction'}
                </Button>
                {editingTransaction ? (
                  <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Transaction history</h2>
            <p className="text-xs text-muted-foreground">
              {transactionsQuery.data ? `${transactionsQuery.data.length} records` : '--'}
            </p>
          </div>

          {transactionsQuery.isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : null}

          {transactionsQuery.isError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
              {getErrorMessage(
                transactionsQuery.error,
                'We could not load your transactions. Please refresh to try again.'
              )}
            </div>
          ) : null}

          {!transactionsQuery.isLoading && !transactionsQuery.isError ? (
            transactionsQuery.data && transactionsQuery.data.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead className="text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Budget</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactionsQuery.data.map((transaction) => {
                      const isIncome = transaction.type === 'INCOME';
                      const budgetName = transaction.budgetId
                        ? budgetLookup.get(transaction.budgetId) ?? transaction.budgetId
                        : '--';

                      return (
                        <tr key={transaction.id}>
                          <td className="py-3 pr-4 font-medium">{transaction.category}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                isIncome ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                              }`}
                            >
                              {isIncome ? 'Income' : 'Expense'}
                            </span>
                          </td>
                          <td className="py-3 pr-4 font-semibold">{formatCurrency(transaction.amount)}</td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {new Date(transaction.occurredAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">{budgetName}</td>
                          <td className="py-3 pr-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(transaction)}
                              >
                                <Edit3 className="mr-1 h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={deletingId === transaction.id}
                                onClick={() => handleDelete(transaction)}
                              >
                                {deletingId === transaction.id ? (
                                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="mr-1 h-4 w-4" />
                                )}
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                No transactions yet. Add your first record to see it here.
              </div>
            )
          ) : null}
        </div>
      </div>
    </section>
  );
}



