import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AccessDenied from '../components/AccessDenied';
import {
  useGetSpendingLimits,
  useSaveSpendingLimits,
  useGetUserTransactions,
} from '../hooks/useQueries';
import { useCurrency } from '../hooks/useCurrency';
import {
  calculateCategorySpent,
  calculateLimitUsage,
  generateSpendingSuggestions,
  generateContextualMessage,
} from '../lib/spending-limits/analysis';
import type { SpendingLimit, SpendingLimitCategory } from '../backend';
import { SpendingLimitCategory as SpendingLimitCategoryEnum } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingBag, Utensils, Car, Tv, Receipt, MoreHorizontal,
  AlertCircle, CheckCircle, Brain, TrendingDown, Loader2, Save
} from 'lucide-react';

const SPENDING_CATEGORIES: {
  value: SpendingLimitCategory;
  label: string;
  icon: React.ReactNode;
  transactionCategories: string[];
}[] = [
  {
    value: SpendingLimitCategoryEnum.food,
    label: 'Food',
    icon: <Utensils className="w-4 h-4" />,
    transactionCategories: ['food', 'groceries', 'restaurant', 'dining'],
  },
  {
    value: SpendingLimitCategoryEnum.transport,
    label: 'Transport',
    icon: <Car className="w-4 h-4" />,
    transactionCategories: ['transport', 'transportation', 'fuel', 'travel'],
  },
  {
    value: SpendingLimitCategoryEnum.shopping,
    label: 'Shopping',
    icon: <ShoppingBag className="w-4 h-4" />,
    transactionCategories: ['shopping', 'clothing', 'fashion'],
  },
  {
    value: SpendingLimitCategoryEnum.entertainment,
    label: 'Entertainment',
    icon: <Tv className="w-4 h-4" />,
    transactionCategories: ['entertainment', 'movies', 'games', 'subscriptions'],
  },
  {
    value: SpendingLimitCategoryEnum.bills,
    label: 'Bills',
    icon: <Receipt className="w-4 h-4" />,
    transactionCategories: ['bills', 'utilities', 'rent', 'insurance'],
  },
  {
    value: SpendingLimitCategoryEnum.other,
    label: 'Other',
    icon: <MoreHorizontal className="w-4 h-4" />,
    transactionCategories: ['other', 'miscellaneous'],
  },
];

export default function SpendingLimits() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: spendingLimits, isLoading } = useGetSpendingLimits();
  const { data: transactions } = useGetUserTransactions();
  const saveSpendingLimits = useSaveSpendingLimits();
  const { format } = useCurrency();

  const [limitInputs, setLimitInputs] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (spendingLimits && spendingLimits.length > 0) {
      const inputs: Record<string, string> = {};
      spendingLimits.forEach((l) => {
        inputs[String(l.category)] = String(l.limitAmount);
      });
      setLimitInputs(inputs);
    }
  }, [spendingLimits]);

  if (!isAuthenticated) return <AccessDenied />;

  const currentMonth = new Date();

  // Calculate spent amounts per category using real transaction data
  const spentByCategory: Record<string, number> = {};
  SPENDING_CATEGORIES.forEach((cat) => {
    let total = 0;
    cat.transactionCategories.forEach((tc) => {
      total += calculateCategorySpent(transactions ?? [], tc, currentMonth);
    });
    spentByCategory[String(cat.value)] = total;
  });

  // Build limits map from saved data
  const limitsMap: Record<string, number> = {};
  (spendingLimits ?? []).forEach((l) => {
    limitsMap[String(l.category)] = l.limitAmount;
  });

  // Merge with input values for display
  const effectiveLimits: SpendingLimit[] = SPENDING_CATEGORIES.map((cat) => ({
    category: cat.value,
    limitAmount: parseFloat(limitInputs[String(cat.value)] ?? '0') || 0,
    user: identity!.getPrincipal(),
    lastUpdated: BigInt(Date.now()),
  }));

  const suggestions = generateSpendingSuggestions(effectiveLimits, spentByCategory);
  const contextualMessage = generateContextualMessage(effectiveLimits, spentByCategory);

  const handleLimitChange = (category: string, value: string) => {
    setLimitInputs((prev) => ({ ...prev, [category]: value }));
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    if (!identity) return;
    const limits: SpendingLimit[] = SPENDING_CATEGORIES.map((cat) => ({
      category: cat.value,
      limitAmount: parseFloat(limitInputs[String(cat.value)] ?? '0') || 0,
      user: identity.getPrincipal(),
      lastUpdated: BigInt(Date.now()),
    }));
    await saveSpendingLimits.mutateAsync(limits);
    setIsDirty(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-primary" />
            Spending Limits
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Set category limits and track real spending from your transactions
          </p>
        </div>
        <Button
          onClick={handleSaveAll}
          disabled={saveSpendingLimits.isPending}
          className="gap-2 shrink-0"
        >
          {saveSpendingLimits.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Limits
        </Button>
      </div>

      {/* Contextual AI Message */}
      <Alert className={`${
        contextualMessage.includes('Excellent') || contextualMessage.includes('within limits in all')
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-amber-500/30 bg-amber-500/5'
      }`}>
        <Brain className="w-4 h-4" />
        <AlertDescription className="text-sm">{contextualMessage}</AlertDescription>
      </Alert>

      {/* Category Limits & Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SPENDING_CATEGORIES.map((cat) => {
          const catKey = String(cat.value);
          const limit = parseFloat(limitInputs[catKey] ?? '0') || 0;
          const spent = spentByCategory[catKey] ?? 0;
          const remaining = Math.max(0, limit - spent);
          const { percentage, status } = calculateLimitUsage(spent, limit);

          return (
            <Card key={catKey} className={`${
              status === 'alert' ? 'border-red-500/40' :
              status === 'warning' ? 'border-amber-500/40' :
              'border-border'
            }`}>
              <CardContent className="pt-4 pb-4 space-y-3">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`${
                      status === 'alert' ? 'text-red-500' :
                      status === 'warning' ? 'text-amber-500' :
                      'text-primary'
                    }`}>
                      {cat.icon}
                    </span>
                    <span className="font-medium text-sm">{cat.label}</span>
                  </div>
                  {status === 'alert' && (
                    <Badge variant="destructive" className="text-xs">Over Limit!</Badge>
                  )}
                  {status === 'warning' && (
                    <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-600">
                      80%+ Used
                    </Badge>
                  )}
                  {status === 'safe' && limit > 0 && (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-500/30">
                      On Track
                    </Badge>
                  )}
                </div>

                {/* Limit Input */}
                <div>
                  <Label className="text-xs text-muted-foreground">Monthly Limit</Label>
                  <Input
                    type="number"
                    placeholder="Set limit..."
                    value={limitInputs[catKey] ?? ''}
                    onChange={(e) => handleLimitChange(catKey, e.target.value)}
                    className="mt-1 h-8 text-sm"
                  />
                </div>

                {/* Progress Bar */}
                {limit > 0 && (
                  <>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Spent: {format(spent)}</span>
                        <span className="font-medium">{Math.round(percentage)}%</span>
                      </div>
                      <Progress
                        value={Math.min(100, percentage)}
                        className={`h-2 ${
                          status === 'alert' ? '[&>div]:bg-red-500' :
                          status === 'warning' ? '[&>div]:bg-amber-500' :
                          ''
                        }`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Limit: {format(limit)}</span>
                        <span className={status === 'alert' ? 'text-red-500' : 'text-green-600'}>
                          {status === 'alert'
                            ? `Over by ${format(spent - limit)}`
                            : `${format(remaining)} left`}
                        </span>
                      </div>
                    </div>

                    {/* Alert Messages */}
                    {status === 'alert' && (
                      <div className="flex items-center gap-1 text-xs text-red-500 bg-red-500/10 rounded p-1.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{cat.label} limit exceeded! Reduce spending immediately.</span>
                      </div>
                    )}
                    {status === 'warning' && (
                      <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-500/10 rounded p-1.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>You've used {Math.round(percentage)}% of your {cat.label} budget.</span>
                      </div>
                    )}
                  </>
                )}

                {limit === 0 && (
                  <p className="text-xs text-muted-foreground">Set a limit to start tracking</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isDirty && (
        <Alert className="border-primary/30 bg-primary/5">
          <AlertDescription className="text-sm flex items-center justify-between">
            <span>You have unsaved changes to your spending limits.</span>
            <Button size="sm" onClick={handleSaveAll} disabled={saveSpendingLimits.isPending} className="ml-2">
              {saveSpendingLimits.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
              Save Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* AI Spending Suggestions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            AI Spending Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {suggestions.map((suggestion, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/20">
              <span className="text-primary text-xs mt-0.5 shrink-0">•</span>
              <p className="text-sm text-muted-foreground">{suggestion}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Integration Note */}
      <Card className="border-muted">
        <CardContent className="pt-3 pb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
            <span>
              Spending data is automatically pulled from your Transactions for the current month (
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}).
              Add transactions to see real-time tracking.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
