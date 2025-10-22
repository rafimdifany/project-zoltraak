'use client';

import type { User } from '@zoltraak/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  AUTH_EVENT,
  clearAuth,
  loadAuth,
  saveAuth,
  type AuthEventDetail,
  type AuthTokens,
  type StoredAuth
} from '@/lib/auth-storage';

type AuthState = {
  user: User | null;
  tokens: AuthTokens | null;
  isInitializing: boolean;
};

type AuthContextValue = {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (auth: StoredAuth) => void;
  updateUser: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isInitializing: true
  });

  useEffect(() => {
    const stored = loadAuth();
    if (stored) {
      setState({
        user: stored.user,
        tokens: stored.tokens,
        isInitializing: false
      });
    } else {
      setState((prev) => ({
        ...prev,
        isInitializing: false
      }));
    }

    if (typeof window === 'undefined') {
      return;
    }

    const listener = (event: Event) => {
      const detail = (event as CustomEvent<AuthEventDetail>).detail;
      setState({
        user: detail.user,
        tokens: detail.tokens,
        isInitializing: false
      });
    };

    window.addEventListener(AUTH_EVENT, listener);

    return () => {
      window.removeEventListener(AUTH_EVENT, listener);
    };
  }, []);

  const setAuth = useCallback((auth: StoredAuth) => {
    saveAuth(auth);
    setState({
      user: auth.user,
      tokens: auth.tokens,
      isInitializing: false
    });
  }, []);

  const updateUser = useCallback((user: User) => {
    setState((prev) => {
      if (!prev.tokens) {
        return prev;
      }
      saveAuth({
        user,
        tokens: prev.tokens
      });
      return {
        ...prev,
        user
      };
    });
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setState({
      user: null,
      tokens: null,
      isInitializing: false
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      tokens: state.tokens,
      isAuthenticated: Boolean(state.user && state.tokens?.accessToken),
      isInitializing: state.isInitializing,
      setAuth,
      updateUser,
      logout
    }),
    [setAuth, updateUser, logout, state.user, state.tokens, state.isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
