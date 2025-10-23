'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import type { Category } from '@zoltraak/types';

type CreateCategoryPayload = {
  name: string;
  parentId?: string | null;
  type?: 'INCOME' | 'EXPENSE';
};

type UpdateCategoryPayload = {
  id: string;
  payload: {
    name?: string;
  };
};

const listCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<{ data: Category[] }>('/categories');
  return response.data.data;
};

const createCategoryRequest = async (payload: CreateCategoryPayload) => {
  const response = await apiClient.post<{ data: Category }>('/categories', payload);
  return response.data.data;
};

const updateCategoryRequest = async ({ id, payload }: UpdateCategoryPayload) => {
  const response = await apiClient.patch<{ data: Category }>(`/categories/${id}`, payload);
  return response.data.data;
};

const deleteCategoryRequest = async (id: string) => {
  await apiClient.delete(`/categories/${id}`);
};

export const useCategories = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  return useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
    enabled: isAuthenticated && !isInitializing
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategoryRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};
