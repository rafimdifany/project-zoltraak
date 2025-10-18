'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import type { Asset } from '@zoltraak/types';

type AssetPayload = {
  name: string;
  category?: string | null;
  currentValue: number;
};

const listAssets = async (): Promise<Asset[]> => {
  const response = await apiClient.get<{ data: Asset[] }>('/assets');
  return response.data.data;
};

const createAssetRequest = async (payload: AssetPayload) => {
  const response = await apiClient.post<{ data: Asset }>('/assets', payload);
  return response.data.data;
};

const updateAssetRequest = async ({
  id,
  payload
}: {
  id: string;
  payload: Partial<AssetPayload>;
}) => {
  const response = await apiClient.put<{ data: Asset }>(`/assets/${id}`, payload);
  return response.data.data;
};

const deleteAssetRequest = async (id: string) => {
  await apiClient.delete(`/assets/${id}`);
};

export const useAssets = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  return useQuery({
    queryKey: ['assets'],
    queryFn: listAssets,
    enabled: isAuthenticated && !isInitializing
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAssetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    }
  });
};
