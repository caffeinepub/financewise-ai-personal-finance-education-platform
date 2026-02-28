import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AccessDenied from '../components/AccessDenied';
import {
  useGetEmergencyFundData,
  useSaveEmergencyFundData,
  useGetUserTransactions,
} from '../hooks/useQueries';
import { useCurrency } from '../hooks/useCurrency';
import {
  calculateTargetAmount,
  calculateProgress,
  calculateEmergencyLevel,
  calculateMonthsCovered,
  calculateSavingPlan,
  generateOptimizedPlan,
} from '../lib/emergency-fund/calculations';
import { generateEmergencyFundSuggestions } from '../lib/emergency-fund/suggestions';
import { getCurrentMonthExpenses, getTopExpenseCategories } from '../lib/transactions/monthlyAggregates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Zap, Loader2, Brain } from 'lucide-react';

export default function EmergencyFund() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: emergencyFundData, isLoading } = useGetEmergencyFundData();
  const { data: transactions } = useGetUserTransactions();
  const saveEmergencyFundData = useSaveEmergencyFundData();
  const { format } = useCurrency();

  const [savedAmountInput, setSavedAmountInput] = useState('');
  const [showOptimized, setShowOptimized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (emergencyFundData) {
      setSavedAmountInput(String(emergencyFundData.savedAmount));
    }
  }, [emergencyFundData]);

  if (!isAuthenticated) return <AccessDenied />;

  const monthlyExpenses = getCurrentMonthExpenses(transactions ?? []);
  const topCategories = getTopExpenseCategories(transactions ?? [], 3);

  const savedAmount = emergencyFundData?.savedAmount ?? 0;
  const targetAmount = calculateTargetAmount(monthlyExpenses);
  const remaining = Math.max(0, targetAmount - savedAmount);
  const progressPct = calculateProgress(savedAmount, targetAmount);
  const emergencyLevel = calculateEmergencyLevel(savedAmount, monthlyExpenses);
  const monthsCovered = calculateMonthsCovered(savedAmount, monthlyExpenses);

  // Estimate available monthly savings as 20% of expenses (conservative)
  const monthlySavingsCapacity = monthlyExpenses * 0.2;
  const savingPlan = calculateSavingPlan(remaining, monthlySavingsCapacity);
  const optimizedPlan = generateOptimizedPlan(remaining, monthlySavingsCapacity);

  const suggestions = generateEmergencyFundSuggestions(
    savedAmount,
    targetAmount,
    monthlyExpenses,
    topCategories.map((c) => ({ category: c.category, amount: c.totalAmount }))
  );

  const levelConfig = {
    Safe: { color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/30', icon: <CheckCircle className="w-5 h-5 text-green-500" />, badge: 'default' as const },
    Moderate: { color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30', icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, badge: 'secondary' as const },
    Low: { color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30', icon: <AlertTriangle className="w-5 h-5 text-red-500" />, badge: 'destructive' as const },
  };

  const levelInfo = levelConfig[emergencyLevel];

  const handleSave = async () => {
    if (!identity) return;
    const amount = parseFloat(savedAmountInput);
    if (isNaN(amount) || amount < 0) return;
    setIsSaving(true);
    try {
      await saveEmergencyFundData.mutateAsync({
        savedAmount: amount,
        user: identity.getPrincipal(),
        lastUpdated: BigInt(Date.now()),
      });
    } finally {
      setIsSaving(false);
    }
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
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Emergency Fund Planner
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI-powered emergency savings plan based on your real expense data
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-3 pb-3">
            <p className="text-xs text-muted-foreground">Monthly Expenses</p>
            <p className="text-lg font-bold text-foreground mt-1">{format(monthlyExpenses)}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardContent className="pt-3 pb-3">
            <p className="text-xs text-muted-foreground">Target (6 months)</p>
            <p className="text-lg font-bold text-primary mt-1">{format(targetAmount)}</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/30">
          <CardContent className="pt-3 pb-3">
            <p className="text-xs text-muted-foreground">Saved</p>
            <p className="text-lg font-bold text-green-500 mt-1">{format(savedAmount)}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30">
          <CardContent className="pt-3 pb-3">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-lg font-bold text-amber-500 mt-1">{format(remaining)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Emergency Fund Progress</span>
            <div className="flex items-center gap-2">
              <Badge variant={levelInfo.badge}>{emergencyLevel}</Badge>
              <span className="text-sm font-bold">{Math.round(progressPct)}%</span>
            </div>
          </div>
          <Progress value={progressPct} className="h-4" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{format(savedAmount)} saved</span>
            <span>Goal: {format(targetAmount)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {monthlyExpenses > 0
              ? `You have ${monthsCovered.toFixed(1)} months of expenses covered`
              : 'Add transactions to calculate your monthly expenses automatically'}
          </p>
        </CardContent>
      </Card>

      {/* Emergency Level Indicator */}
      <Card className={`border ${levelInfo.bg}`}>
        <CardContent className="pt-4 pb-4 flex items-start gap-3">
          {levelInfo.icon}
          <div>
            <p className="font-semibold text-sm">
              {emergencyLevel === 'Safe' && 'Your emergency fund is strong! You have 6+ months covered.'}
              {emergencyLevel === 'Moderate' && `You have ${monthsCovered.toFixed(1)} months covered. Aim for 6 months for full security.`}
              {emergencyLevel === 'Low' && `You have ${monthsCovered.toFixed(1)} months covered. Try to build up to at least 3 months as soon as possible.`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Safe = 6+ months | Moderate = 3–5 months | Low = below 3 months
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Update Saved Amount */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Update Saved Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Current Emergency Fund Balance</Label>
              <Input
                type="number"
                placeholder="0"
                value={savedAmountInput}
                onChange={(e) => setSavedAmountInput(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Saving Plan */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            AI Saving Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Monthly Savings Required</p>
              <p className="text-xl font-bold text-primary mt-1">{format(savingPlan.monthlyRequired)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Estimated Completion</p>
              <p className="text-xl font-bold text-foreground mt-1">
                {remaining <= 0 ? 'Achieved! 🎉' : `${savingPlan.monthsToGoal} months`}
              </p>
            </div>
          </div>

          <Separator />

          {/* Optimize Button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowOptimized(!showOptimized)}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            {showOptimized ? 'Hide Optimized Plan' : 'Optimize Emergency Plan 🚀'}
          </Button>

          {showOptimized && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
              <p className="text-sm font-semibold text-primary">Optimized Strategy</p>
              <p className="text-xs text-muted-foreground">{optimizedPlan.strategy}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Target</p>
                  <p className="text-base font-bold text-primary">{format(optimizedPlan.monthlyRequired)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completion</p>
                  <p className="text-base font-bold text-foreground">
                    {remaining <= 0 ? 'Done!' : `${optimizedPlan.monthsToGoal} months`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Smart AI Suggestions
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
    </div>
  );
}
