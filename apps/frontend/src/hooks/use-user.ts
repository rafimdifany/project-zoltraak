import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import type { CurrencyCode, User } from '@zoltraak/types';

type UpdateCurrencyPayload = {
  currency: CurrencyCode;
};

const updateCurrencyRequest = async (payload: UpdateCurrencyPayload) => {
  const response = await apiClient.put<{ user: User }>('/user/currency', payload);
  return response.data.user;
};

export const useUpdateCurrency = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: updateCurrencyRequest,
    onSuccess: (user) => {
      updateUser(user);
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset-groups'] });
    }
  });
};
