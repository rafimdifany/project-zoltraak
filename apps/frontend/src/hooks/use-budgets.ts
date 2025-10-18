'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import type { Budget } from '@zoltraak/types';

type BudgetPayload = {
  name: string;
  targetAmount: number;
  periodStart: string;
  periodEnd: string;
};

const listBudgets = async (): Promise<Budget[]> => {
  const response = await apiClient.get<{ data: Budget[] }>('/budgets');
  return response.data.data;
};

const createBudgetRequest = async (payload: BudgetPayload) => {
  const response = await apiClient.post<{ data: Budget }>('/budgets', payload);
  return response.data.data;
};

const updateBudgetRequest = async ({
  id,
  payload
}: {
  id: string;
  payload: Partial<BudgetPayload>;
}) => {
  const response = await apiClient.put<{ data: Budget }>(`/budgets/${id}`, payload);
  return response.data.data;
};

const deleteBudgetRequest = async (id: string) => {
  await apiClient.delete(`/budgets/${id}`);
};

export const useBudgets = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  return useQuery({
    queryKey: ['budgets'],
    queryFn: listBudgets,
    enabled: isAuthenticated && !isInitializing
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudgetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudgetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};
