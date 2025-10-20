'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
};

const STORAGE_KEY = 'zoltraak.theme';

const applyThemeClass = (theme: Theme) => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.setProperty('color-scheme', theme);
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isReady, setIsReady] = useState(false);
  const isInitializedRef = useRef(false);
  const userPreferenceRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme = stored ?? 'dark';
    setThemeState(initialTheme);
    applyThemeClass(initialTheme);
    isInitializedRef.current = true;
    userPreferenceRef.current = stored !== null;
    setIsReady(true);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (userPreferenceRef.current) {
        return;
      }

      const next = event.matches ? 'dark' : 'light';
      setThemeState(next);
      applyThemeClass(next);
    };

    try {
      media.addEventListener('change', handleMediaChange);
      return () => media.removeEventListener('change', handleMediaChange);
    } catch {
      // Safari fallback
      media.addListener(handleMediaChange);
      return () => media.removeListener(handleMediaChange);
    }
  }, []);

  useEffect(() => {
    if (!isInitializedRef.current) {
      return;
    }

    applyThemeClass(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    userPreferenceRef.current = true;
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      userPreferenceRef.current = true;
      return next;
    });
  }, []);

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    setTheme,
    isReady
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
