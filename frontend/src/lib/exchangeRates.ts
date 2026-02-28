export type CurrencyCode = 'USD' | 'INR' | 'EUR';

export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  INR: 83.0,
  EUR: 0.92,
};

export const CACHE_DURATION_MS = 3600000; // 1 hour

interface CachedRates {
  rates: Record<CurrencyCode, number>;
  timestamp: number;
}

const CACHE_KEY = 'fw_exchange_rates';

export function getCachedRates(): Record<CurrencyCode, number> | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedRates = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_DURATION_MS) return null;
    return cached.rates;
  } catch {
    return null;
  }
}

export function setCachedRates(rates: Record<CurrencyCode, number>): void {
  try {
    const cached: CachedRates = { rates, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // ignore
  }
}

export async function fetchExchangeRates(): Promise<Record<CurrencyCode, number> | null> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.rates) return null;
    const rates: Record<CurrencyCode, number> = {
      USD: 1.0,
      INR: data.rates.INR ?? FALLBACK_RATES.INR,
      EUR: data.rates.EUR ?? FALLBACK_RATES.EUR,
    };
    setCachedRates(rates);
    return rates;
  } catch {
    return null;
  }
}
