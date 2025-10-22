import { useCallback, useMemo } from 'react';

import { useAuth } from '@/contexts/auth-context';
import type { CurrencyCode } from '@zoltraak/types';

const DEFAULT_CURRENCY: CurrencyCode = 'USD';

const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  SDG: 'SDG',
  INR: '₹',
  JPY: '¥',
  RUB: '₽',
  GBP: '£',
  EUR: '€',
  CNY: '¥',
  IDR: 'Rp',
  MYR: 'RM',
  AUD: 'A$',
  BRL: 'R$',
  SAR: '﷼',
  AED: 'د.إ'
};

export const useCurrencyFormatter = () => {
  const { user } = useAuth();

  const currency = (user?.currency ?? DEFAULT_CURRENCY) as CurrencyCode;

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }),
    [currency]
  );

  const format = useCallback((value: number) => formatter.format(value), [formatter]);

  return {
    format,
    currency,
    symbol: currencySymbols[currency] ?? ''
  };
};

export const getCurrencySymbol = (code: CurrencyCode | null | undefined) => {
  if (!code) {
    return currencySymbols[DEFAULT_CURRENCY];
  }
  return currencySymbols[code] ?? currencySymbols[DEFAULT_CURRENCY];
};
