// Currency conversion and formatting utilities

export type Currency = 'usd' | 'inr' | 'eur';

// Exchange rates (relative to USD as base)
const EXCHANGE_RATES: Record<Currency, number> = {
  usd: 1,
  inr: 83.12, // 1 USD = 83.12 INR (approximate)
  eur: 0.92,  // 1 USD = 0.92 EUR (approximate)
};

// Currency symbols
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  usd: '$',
  inr: '₹',
  eur: '€',
};

// Currency names
const CURRENCY_NAMES: Record<Currency, string> = {
  usd: 'USD',
  inr: 'INR',
  eur: 'EUR',
};

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount;
  
  // Convert to USD first (base currency)
  const amountInUSD = amount / EXCHANGE_RATES[from];
  
  // Convert from USD to target currency
  return amountInUSD * EXCHANGE_RATES[to];
}

/**
 * Format amount with currency symbol and locale
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const locale = currency === 'inr' ? 'en-IN' : currency === 'eur' ? 'de-DE' : 'en-US';
  
  const formatted = Math.abs(amount).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${symbol}${formatted}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency];
}

/**
 * Get currency name
 */
export function getCurrencyName(currency: Currency): string {
  return CURRENCY_NAMES[currency];
}

/**
 * Hook to get current currency from user preferences
 */
export function useCurrentCurrency(): Currency {
  // This will be imported and used in components
  return 'usd'; // Default, will be overridden by actual hook
}
