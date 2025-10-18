'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import type { StoredAuth } from '@/lib/auth-storage';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  displayName: string;
  email: string;
  password: string;
};

type AuthResponse = StoredAuth;

const loginRequest = async (payload: LoginPayload) => {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
};

const registerRequest = async (payload: RegisterPayload) => {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload);
  return response.data;
};

export const useLogin = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (auth) => {
      setAuth(auth);
      router.replace('/dashboard');
    }
  });
};

export const useRegister = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: registerRequest,
    onSuccess: (auth) => {
      setAuth(auth);
      router.replace('/dashboard');
    }
  });
};
