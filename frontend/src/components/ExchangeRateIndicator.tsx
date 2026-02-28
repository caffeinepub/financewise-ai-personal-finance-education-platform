import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencyCode, fetchExchangeRates, getCachedRates, FALLBACK_RATES } from '../lib/exchangeRates';

interface Props {
  currentCurrency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  ratesFromLive: boolean;
  onRatesRefreshed?: (rates: Record<CurrencyCode, number>) => void;
}

export default function ExchangeRateIndicator({
  currentCurrency,
  rates,
  ratesFromLive,
  onRatesRefreshed,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Clear cache by fetching fresh
      const fresh = await fetchExchangeRates();
      if (fresh && onRatesRefreshed) onRatesRefreshed(fresh);
    } finally {
      setRefreshing(false);
    }
  };

  const rate = currentCurrency === 'USD' ? 1 : rates[currentCurrency];
  const rateLabel =
    currentCurrency === 'USD'
      ? '1 USD = 1.00 USD'
      : `1 USD = ${rate.toFixed(2)} ${currentCurrency}`;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span
        className={`w-2 h-2 rounded-full ${ratesFromLive ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
      />
      <span>{rateLabel}</span>
      <span className="text-muted-foreground/60">
        {ratesFromLive ? '(live)' : '(fallback)'}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={handleRefresh}
        disabled={refreshing}
        title="Refresh exchange rates"
      >
        <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
