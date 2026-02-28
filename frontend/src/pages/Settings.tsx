import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Bell, BarChart2, Globe, RefreshCw } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '../hooks/useCurrency';
import ExchangeRateIndicator from '../components/ExchangeRateIndicator';
import { useGetUserPreferences, useSaveUserPreferences } from '../hooks/useQueries';
import { Currency } from '../backend';
import { toast } from 'sonner';

const CURRENCY_OPTIONS = [
  { code: 'USD', label: 'USD — US Dollar', symbol: '$', value: Currency.usd },
  { code: 'INR', label: 'INR — Indian Rupee', symbol: '₹', value: Currency.inr },
  { code: 'EUR', label: 'EUR — Euro', symbol: '€', value: Currency.eur },
] as const;

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { data: preferences, isLoading } = useGetUserPreferences();
  const savePreferences = useSaveUserPreferences();
  const { currencyCode, rates, ratesFromLive } = useCurrency();

  const [notifications, setNotifications] = useState(true);
  const [analyticsVisible, setAnalyticsVisible] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.usd);
  const [savingCurrency, setSavingCurrency] = useState(false);

  useEffect(() => {
    if (preferences) {
      setNotifications(preferences.notificationsEnabled);
      setAnalyticsVisible(preferences.analyticsVisible);
      setSelectedCurrency(preferences.currency);
    }
  }, [preferences]);

  const handleSavePreferences = async (overrides?: Partial<{ currency: Currency; notifications: boolean; analyticsVisible: boolean }>) => {
    const prefs = {
      themeMode: theme ?? 'system',
      notificationsEnabled: overrides?.notifications ?? notifications,
      analyticsVisible: overrides?.analyticsVisible ?? analyticsVisible,
      currency: overrides?.currency ?? selectedCurrency,
      updatedAt: BigInt(Date.now()),
    };
    try {
      await savePreferences.mutateAsync(prefs);
    } catch {
      // error handled by mutation
    }
  };

  const handleCurrencyChange = async (currency: Currency) => {
    setSelectedCurrency(currency);
    setSavingCurrency(true);
    try {
      await handleSavePreferences({ currency });
      toast.success('Currency updated! All monetary values will now display in the selected currency.');
    } finally {
      setSavingCurrency(false);
    }
  };

  const handleToggleNotifications = async (val: boolean) => {
    setNotifications(val);
    await handleSavePreferences({ notifications: val });
  };

  const handleToggleAnalytics = async (val: boolean) => {
    setAnalyticsVisible(val);
    localStorage.setItem('analyticsVisible', String(val));
    await handleSavePreferences({ analyticsVisible: val });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your preferences and application settings.
        </p>
      </div>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            {[
              { value: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
              { value: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
              { value: 'system', icon: <Monitor className="w-4 h-4" />, label: 'System' },
            ].map((opt) => (
              <Button
                key={opt.value}
                variant={theme === opt.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTheme(opt.value);
                  handleSavePreferences();
                }}
                className="gap-2"
              >
                {opt.icon}
                {opt.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Currency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select your preferred currency. This affects all monetary displays across the app — Dashboard, Transactions, Analytics, Budget Planner, and Goals.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CURRENCY_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => handleCurrencyChange(opt.value)}
                disabled={savingCurrency}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                  selectedCurrency === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-2xl font-bold text-primary">{opt.symbol}</span>
                <div>
                  <p className="font-semibold text-sm">{opt.code}</p>
                  <p className="text-xs text-muted-foreground">{opt.label.split('—')[1]?.trim()}</p>
                </div>
                {selectedCurrency === opt.value && (
                  <Badge variant="default" className="ml-auto text-xs">Active</Badge>
                )}
              </button>
            ))}
          </div>
          {savingCurrency && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Saving currency preference...
            </div>
          )}
          <ExchangeRateIndicator
            currentCurrency={currencyCode}
            rates={rates}
            ratesFromLive={ratesFromLive}
          />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Receive alerts for budget limits and goal milestones.
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={handleToggleNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics">Show Analytics</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Display the Analytics page in the navigation.
              </p>
            </div>
            <Switch
              id="analytics"
              checked={analyticsVisible}
              onCheckedChange={handleToggleAnalytics}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />
      <p className="text-xs text-muted-foreground text-center">
        Settings are saved to your account and sync across devices.
      </p>
    </div>
  );
}
