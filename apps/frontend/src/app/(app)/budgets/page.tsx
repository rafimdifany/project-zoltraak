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
import { useBudgets, useCreateBudget, useDeleteBudget, useUpdateBudget } from '@/hooks/use-budgets';
import { useTransactions } from '@/hooks/use-transactions';
import { getErrorMessage } from '@/lib/http-error';
import type { Budget, Transaction } from '@zoltraak/types';

const budgetFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    targetAmount: z.coerce.number().positive('Target amount must be greater than 0'),
    periodStart: z.string().min(1, 'Start date is required'),
    periodEnd: z.string().min(1, 'End date is required')
  })
  .refine(
    (values) => new Date(values.periodEnd) >= new Date(values.periodStart),
    {
      message: 'End date must be on or after the start date',
      path: ['periodEnd']
    }
  );

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

const createDefaultValues = (): BudgetFormValues => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    name: '',
    targetAmount: 0,
    periodStart: today,
    periodEnd: today
  };
};

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

export default function BudgetsPage() {
  const budgetsQuery = useBudgets();
  const transactionsQuery = useTransactions();

  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: createDefaultValues()
  });

  const budgets = budgetsQuery.data ?? [];

  const expensesByBudget = useMemo(() => {
    const map = new Map<string, number>();
    if (!transactionsQuery.data) {
      return map;
    }

    transactionsQuery.data
      .filter((transaction: Transaction) => transaction.type === 'EXPENSE' && transaction.budgetId)
      .forEach((transaction) => {
        const budgetId = transaction.budgetId as string;
        const currentTotal = map.get(budgetId) ?? 0;
        map.set(budgetId, currentTotal + transaction.amount);
      });

    return map;
  }, [transactionsQuery.data]);

  const isSubmitting = createBudget.isPending || updateBudget.isPending;

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setActionError(null);
    reset({
      name: budget.name,
      targetAmount: budget.targetAmount,
      periodStart: budget.periodStart.slice(0, 10),
      periodEnd: budget.periodEnd.slice(0, 10)
    });
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
    setActionError(null);
    reset(createDefaultValues());
  };

  const handleDelete = async (budget: Budget) => {
    const confirmed = window.confirm('Delete this budget? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeletingId(budget.id);
    setActionError(null);

    try {
      await deleteBudget.mutateAsync(budget.id);
      if (editingBudget?.id === budget.id) {
        handleCancelEdit();
      }
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to delete the budget. Please try again.'));
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setActionError(null);

    const payload = {
      name: values.name,
      targetAmount: values.targetAmount,
      periodStart: new Date(values.periodStart).toISOString(),
      periodEnd: new Date(values.periodEnd).toISOString()
    };

    try {
      if (editingBudget) {
        await updateBudget.mutateAsync({
          id: editingBudget.id,
          payload
        });
        handleCancelEdit();
      } else {
        await createBudget.mutateAsync(payload);
        reset(createDefaultValues());
      }
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to save the budget. Please try again.'));
    }
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Budgets</h1>
        <p className="text-sm text-muted-foreground">Create envelopes and track progress toward each goal.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editingBudget ? 'Edit budget' : 'Add a new budget'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Q4 Operating Budget" {...register('name')} />
                  {errors.name ? <p className="text-xs text-rose-500">{errors.name.message}</p> : null}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="targetAmount">Target amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="5000.00"
                    {...register('targetAmount')}
                  />
                  {errors.targetAmount ? (
                    <p className="text-xs text-rose-500">{errors.targetAmount.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="periodStart">Start date</Label>
                  <Input id="periodStart" type="date" {...register('periodStart')} />
                  {errors.periodStart ? (
                    <p className="text-xs text-rose-500">{errors.periodStart.message}</p>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="periodEnd">End date</Label>
                  <Input id="periodEnd" type="date" {...register('periodEnd')} />
                  {errors.periodEnd ? <p className="text-xs text-rose-500">{errors.periodEnd.message}</p> : null}
                </div>
              </div>

              {actionError ? <p className="text-sm text-rose-500">{actionError}</p> : null}

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingBudget ? 'Save changes' : 'Add budget'}
                </Button>
                {editingBudget ? (
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
            <h2 className="text-lg font-semibold">Budget lineup</h2>
            <p className="text-xs text-muted-foreground">
              {budgetsQuery.data ? `${budgetsQuery.data.length} total` : '-'}
            </p>
          </div>

          {budgetsQuery.isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : null}

          {budgetsQuery.isError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
              {getErrorMessage(
                budgetsQuery.error,
                'We could not load your budgets. Please refresh to try again.'
              )}
            </div>
          ) : null}

          {!budgetsQuery.isLoading && !budgetsQuery.isError ? (
            budgets.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead className="text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Period</th>
                      <th className="py-2 pr-4">Target</th>
                      <th className="py-2 pr-4">Spent</th>
                      <th className="py-2 pr-4">Progress</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {budgets.map((budget) => {
                      const spent = expensesByBudget.get(budget.id) ?? 0;
                      const progress = Math.min(100, Math.round((spent / budget.targetAmount) * 100));
                      const period = `${new Date(budget.periodStart).toLocaleDateString()} - ${new Date(
                        budget.periodEnd
                      ).toLocaleDateString()}`;

                      return (
                        <tr key={budget.id}>
                          <td className="py-3 pr-4 font-medium">{budget.name}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{period}</td>
                          <td className="py-3 pr-4 font-semibold">{formatCurrency(budget.targetAmount)}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{formatCurrency(spent)}</td>
                          <td className="py-3 pr-4">
                            <div className="space-y-1">
                              <div className="h-2 rounded-full bg-muted">
                                <div
                                  className={`h-2 rounded-full ${
                                    progress > 90 ? 'bg-rose-500' : 'bg-primary'
                                  }`}
                                  style={{ width: `${isFinite(progress) ? progress : 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {isFinite(progress) ? `${progress}%` : '-'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(budget)}
                              >
                                <Edit3 className="mr-1 h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={deletingId === budget.id}
                                onClick={() => handleDelete(budget)}
                              >
                                {deletingId === budget.id ? (
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
                No budgets yet. Create your first envelope to start tracking spending.
              </div>
            )
          ) : null}
        </div>
      </div>
    </section>
  );
}
