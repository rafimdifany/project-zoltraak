'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import type { Transaction } from '@zoltraak/types';

type TransactionPayload = {
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  occurredAt: string;
  description?: string | null;
  budgetId?: string | null;
};

const listTransactions = async (): Promise<Transaction[]> => {
  const response = await apiClient.get<{ data: Transaction[] }>('/transactions');
  return response.data.data;
};

const createTransactionRequest = async (payload: TransactionPayload) => {
  const response = await apiClient.post<{ data: Transaction }>('/transactions', payload);
  return response.data.data;
};

const updateTransactionRequest = async ({
  id,
  payload
}: {
  id: string;
  payload: Partial<TransactionPayload>;
}) => {
  const response = await apiClient.put<{ data: Transaction }>(`/transactions/${id}`, payload);
  return response.data.data;
};

const deleteTransactionRequest = async (id: string) => {
  await apiClient.delete(`/transactions/${id}`);
};

export const useTransactions = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  return useQuery({
    queryKey: ['transactions'],
    queryFn: listTransactions,
    enabled: isAuthenticated && !isInitializing
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransactionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransactionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransactionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};
