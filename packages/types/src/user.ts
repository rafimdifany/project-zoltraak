export type UserRole = 'USER' | 'PREMIUM' | 'ADMIN';

export type CurrencyCode =
  | 'USD'
  | 'SGD'
  | 'INR'
  | 'JPY'
  | 'RUB'
  | 'GBP'
  | 'EUR'
  | 'CNY'
  | 'IDR'
  | 'MYR'
  | 'AUD'
  | 'BRL'
  | 'SAR'
  | 'AED';

export interface User {
  id: string;
  email: string;
  displayName?: string | null;
  role: UserRole;
  currency?: CurrencyCode | null;
  createdAt: string;
  updatedAt: string;
}
