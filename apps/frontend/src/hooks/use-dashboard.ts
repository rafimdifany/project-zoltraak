import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { DashboardOverview } from '@zoltraak/types';

const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await apiClient.get<{ data: DashboardOverview }>('/dashboard');
  return response.data.data;
};

export const useDashboardOverview = () =>
  useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: fetchDashboardOverview
  });
