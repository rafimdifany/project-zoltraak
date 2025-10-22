'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import type { Asset, AssetGroup } from '@zoltraak/types';

type AssetPayload = {
  name: string;
  groupId: string;
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

const listAssetGroups = async (): Promise<AssetGroup[]> => {
  const response = await apiClient.get<{ data: AssetGroup[] }>('/assets/groups');
  return response.data.data;
};

const createAssetGroupRequest = async (payload: { name: string }) => {
  const response = await apiClient.post<{ data: AssetGroup }>('/assets/groups', payload);
  return response.data.data;
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

export const useAssetGroups = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  return useQuery({
    queryKey: ['asset-groups'],
    queryFn: listAssetGroups,
    enabled: isAuthenticated && !isInitializing,
    staleTime: 1000 * 60 * 5
  });
};

export const useCreateAssetGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssetGroupRequest,
    onSuccess: (group) => {
      queryClient.setQueryData<AssetGroup[]>(['asset-groups'], (previous) => {
        const base = previous ?? [];
        const existing = base.find((item) => item.id === group.id);
        const updated = existing
          ? base.map((item) => (item.id === group.id ? group : item))
          : [...base, group];

        return updated.sort((a, b) => {
          const createdDiff =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          return createdDiff !== 0 ? createdDiff : a.name.localeCompare(b.name);
        });
      });
    }
  });
};
