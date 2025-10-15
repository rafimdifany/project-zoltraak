const defaultLocale = 'en-US';
const defaultCurrency = 'USD';

export const formatCurrency = (value: number, locale = defaultLocale, currency = defaultCurrency) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

export const formatDate = (value: string | number | Date, locale = defaultLocale) => {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const formatDateRange = (
  start: string | number | Date,
  end: string | number | Date,
  locale = defaultLocale
) => {
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);

  return `${formatDate(startDate, locale)} - ${formatDate(endDate, locale)}`;
};
