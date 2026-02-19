import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerUserPreferences, useSaveUserPreferences } from '../hooks/useQueries';
import { User, Bell, Eye, Shield, Moon, Sun, DollarSign, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import AccessDenied from '../components/AccessDenied';
import type { UserProfile } from '../backend';
import type { UserPreferences, Currency } from '../types/backend-types';

const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: '$',
  inr: '₹',
  eur: '€',
};

const CURRENCY_NAMES: Record<string, string> = {
  usd: 'US Dollar',
  inr: 'Indian Rupee',
  eur: 'Euro',
};

export default function Settings() {
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: preferences } = useGetCallerUserPreferences();
  const savePreferences = useSaveUserPreferences();
  const { theme, setTheme } = useTheme();

  const [localPrefs, setLocalPrefs] = useState<UserPreferences>({
    themeMode: 'system',
    notificationsEnabled: true,
    analyticsVisible: true,
    currency: 'inr' as Currency,
    updatedAt: Date.now(),
  });

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
      // Sync theme with saved preference
      if (preferences.themeMode && preferences.themeMode !== theme) {
        setTheme(preferences.themeMode);
      }
    }
  }, [preferences]);

  if (!identity) {
    return <AccessDenied />;
  }

  const handleSavePreferences = async () => {
    try {
      await savePreferences.mutateAsync({
        ...localPrefs,
        themeMode: theme || 'system',
        updatedAt: Date.now(),
      });
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setLocalPrefs({ ...localPrefs, themeMode: newTheme });
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setLocalPrefs({ ...localPrefs, currency: newCurrency as Currency });
  };

  const selectedCurrencySymbol = CURRENCY_SYMBOLS[localPrefs.currency] || '$';
  const selectedCurrencyName = CURRENCY_NAMES[localPrefs.currency] || 'US Dollar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Your personal information and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={userProfile?.name || 'Not set'} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={userProfile?.email || 'Not set'} disabled />
              </div>
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input value={userProfile?.id || 'Not set'} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <CardTitle>Display Preferences</CardTitle>
            </div>
            <CardDescription>Customize how you view your financial data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label>Currency</Label>
                <p className="text-sm text-muted-foreground">
                  Select your preferred currency ({selectedCurrencySymbol})
                </p>
              </div>
              <Select value={localPrefs.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-40">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{selectedCurrencySymbol} {localPrefs.currency.toUpperCase()}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">$</span>
                      <span>USD - US Dollar</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inr">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₹</span>
                      <span>INR - Indian Rupee</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="eur">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">€</span>
                      <span>EUR - Euro</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Analytics</Label>
                <p className="text-sm text-muted-foreground">Display financial analytics on dashboard</p>
              </div>
              <Switch
                checked={localPrefs.analyticsVisible}
                onCheckedChange={(checked) => setLocalPrefs({ ...localPrefs, analyticsVisible: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your finances</p>
              </div>
              <Switch
                checked={localPrefs.notificationsEnabled}
                onCheckedChange={(checked) => setLocalPrefs({ ...localPrefs, notificationsEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Your account security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Internet Identity</p>
                  <p className="text-sm text-muted-foreground">Secure authentication via Internet Computer</p>
                </div>
                <Badge className="bg-green-500/20 text-green-600 border-green-500/20">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleSavePreferences}
            disabled={savePreferences.isPending}
            className="bg-gradient-to-r from-primary to-chart-1"
          >
            {savePreferences.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
