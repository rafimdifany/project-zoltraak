'use client';

import axios from 'axios';

import { clearAuth, loadAuth } from '@/lib/auth-storage';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const stored = loadAuth();
  if (stored?.tokens.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${stored.tokens.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const authRoutes = ['/login', '/register'];
        if (!authRoutes.includes(path)) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);
