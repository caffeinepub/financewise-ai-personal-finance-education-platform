import { useCallback, useEffect, useState } from "react";
import { Currency } from "../backend";
import {
  type CurrencyCode,
  FALLBACK_RATES,
  fetchExchangeRates,
  getCachedRates,
} from "../lib/exchangeRates";
import { useGetUserPreferences } from "./useQueries";

export type { CurrencyCode };

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  INR: "₹",
  EUR: "€",
};

function backendCurrencyToCode(currency: Currency | undefined): CurrencyCode {
  if (!currency) return "USD";
  switch (currency) {
    case Currency.inr:
      return "INR";
    case Currency.eur:
      return "EUR";
    default:
      return "USD";
  }
}

export function useCurrency() {
  const { data: preferences } = useGetUserPreferences();
  const currencyCode = backendCurrencyToCode(preferences?.currency);
  const [rates, setRates] =
    useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [ratesFromLive, setRatesFromLive] = useState(false);

  useEffect(() => {
    const cached = getCachedRates();
    if (cached) {
      setRates(cached);
      setRatesFromLive(true);
      return;
    }
    fetchExchangeRates().then((fetched) => {
      if (fetched) {
        setRates(fetched);
        setRatesFromLive(true);
      }
    });
  }, []);

  const getCurrencySymbol = useCallback(
    (code?: CurrencyCode) => CURRENCY_SYMBOLS[code ?? currencyCode],
    [currencyCode],
  );

  const convertFromUSD = useCallback(
    (amountUSD: number, targetCode?: CurrencyCode): number => {
      const target = targetCode ?? currencyCode;
      return amountUSD * (rates[target] ?? FALLBACK_RATES[target]);
    },
    [currencyCode, rates],
  );

  const convertToUSD = useCallback(
    (amount: number, sourceCode?: CurrencyCode): number => {
      const source = sourceCode ?? currencyCode;
      const rate = rates[source] ?? FALLBACK_RATES[source];
      return rate === 0 ? 0 : amount / rate;
    },
    [currencyCode, rates],
  );

  const format = useCallback(
    (amountUSD: number): string => {
      const converted = convertFromUSD(amountUSD);
      const symbol = CURRENCY_SYMBOLS[currencyCode];
      if (currencyCode === "INR") {
        return `${symbol}${converted.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
      }
      return `${symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    [currencyCode, convertFromUSD],
  );

  const formatCurrency = format;

  return {
    currencyCode,
    symbol: CURRENCY_SYMBOLS[currencyCode],
    getCurrencySymbol,
    format,
    formatCurrency,
    convertFromUSD,
    convertToUSD,
    rates,
    ratesFromLive,
  };
}
