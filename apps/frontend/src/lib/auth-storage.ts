'use client';

import type { User } from '@zoltraak/types';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type StoredAuth = {
  user: User;
  tokens: AuthTokens;
};

type AuthEventDetail = {
  user: User | null;
  tokens: AuthTokens | null;
};

const STORAGE_KEY = 'zoltraak.auth';
const AUTH_EVENT = 'zoltraak:auth';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const emit = (detail: AuthEventDetail) => {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent<AuthEventDetail>(AUTH_EVENT, { detail }));
};

export const loadAuth = (): StoredAuth | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StoredAuth;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const saveAuth = (auth: StoredAuth) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  emit({ user: auth.user, tokens: auth.tokens });
};

export const clearAuth = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  emit({ user: null, tokens: null });
};

export { AUTH_EVENT };
export type { AuthTokens, AuthEventDetail, StoredAuth };
