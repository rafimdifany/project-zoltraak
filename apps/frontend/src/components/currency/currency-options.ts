import type { CurrencyCode } from '@zoltraak/types';

export type CurrencyOption = {
  code: CurrencyCode;
  label: string;
  symbol: string;
  icon: string;
};

export const currencyOptions: CurrencyOption[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$', icon: '🇺🇸' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', icon: '🇸🇬' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹', icon: '🇮🇳' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥', icon: '🇯🇵' },
  { code: 'RUB', label: 'Russian Ruble', symbol: '₽', icon: '🇷🇺' },
  { code: 'GBP', label: 'British Pound Sterling', symbol: '£', icon: '🇬🇧' },
  { code: 'EUR', label: 'Euro', symbol: '€', icon: '🇪🇺' },
  { code: 'CNY', label: 'Chinese Yuan', symbol: '¥', icon: '🇨🇳' },
  { code: 'IDR', label: 'Indonesian Rupiah', symbol: 'Rp', icon: '🇮🇩' },
  { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM', icon: '🇲🇾' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$', icon: '🇦🇺' },
  { code: 'BRL', label: 'Brazilian Real', symbol: 'R$', icon: '🇧🇷' },
  { code: 'SAR', label: 'Saudi Riyal', symbol: '﷼', icon: '🇸🇦' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ', icon: '🇦🇪' }
];

export const findCurrencyOption = (code?: CurrencyCode | null) =>
  currencyOptions.find((option) => option.code === code);
