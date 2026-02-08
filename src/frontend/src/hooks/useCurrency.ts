import { useMemo } from 'react';
import { useGetCallerUserPreferences } from './useQueries';
import { Currency } from '../types/backend-types';

const EXCHANGE_RATES: Record<Currency, number> = {
  [Currency.usd]: 1,
  [Currency.inr]: 83,
  [Currency.eur]: 0.92,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.usd]: '$',
  [Currency.inr]: '₹',
  [Currency.eur]: '€',
};

const CURRENCY_LOCALES: Record<Currency, string> = {
  [Currency.usd]: 'en-US',
  [Currency.inr]: 'en-IN',
  [Currency.eur]: 'de-DE',
};

export function useCurrency() {
  const { data: preferences } = useGetCallerUserPreferences();
  const currency = preferences?.currency || Currency.inr;

  const convert = useMemo(() => {
    return (amount: number, from: Currency = Currency.inr, to: Currency = currency): number => {
      const amountInUSD = amount / EXCHANGE_RATES[from];
      return amountInUSD * EXCHANGE_RATES[to];
    };
  }, [currency]);

  const format = useMemo(() => {
    return (amount: number, from: Currency = Currency.inr): string => {
      const convertedAmount = convert(amount, from, currency);
      return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(convertedAmount);
    };
  }, [currency, convert]);

  return {
    currency,
    symbol: CURRENCY_SYMBOLS[currency],
    convert,
    format,
  };
}
