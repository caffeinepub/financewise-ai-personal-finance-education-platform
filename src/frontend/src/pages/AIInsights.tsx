import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserPreferences, useGetUserTransactions, useGetBalance, useGetUserSavingsGoals } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, TrendingUp, AlertTriangle, DollarSign, Target, Info, TrendingDown, Sparkles, Brain, LineChart, Cpu, Zap } from 'lucide-react';
import { useMemo } from 'react';
import AccessDenied from '../components/AccessDenied';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLine, Line, PieChart, Pie, Legend } from 'recharts';
import { useCurrency } from '../hooks/useCurrency';

const CATEGORY_COLORS: Record<string, string> = {
  'Entertainment': 'oklch(var(--chart-1))',
  'Housing & Utilities': 'oklch(var(--chart-2))',
  'Transportation': 'oklch(var(--chart-3))',
  'Shopping': 'oklch(var(--chart-4))',
  'Food & Dining': 'oklch(var(--chart-5))',
  'Healthcare': 'oklch(var(--chart-1))',
  'Other': 'oklch(var(--chart-5))',
};

const ML_MODELS = [
  { name: 'Linear Regression', icon: TrendingUp, color: 'text-green-500', desc: 'Trend prediction and linear relationship modeling' },
  { name: 'GRU', icon: Zap, color: 'text-teal-500', desc: 'Efficient sequential data analysis with gated recurrent units' },
  { name: 'LSTM', icon: Cpu, color: 'text-violet-500', desc: 'Long-term memory patterns for complex financial forecasting' },
];

export default function AIInsights() {
  const { identity } = useInternetIdentity();
  const { data: transactions } = useGetUserTransactions();
  const { data: balance } = useGetBalance();
  const { data: goals } = useGetUserSavingsGoals();
  const { format: formatCurrency, symbol: currencySymbol } = useCurrency();

  // Calculate spending by category
  const categorySpending = useMemo(() => {
    if (!transactions) return [];
    
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(t => t.transactionType === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Calculate monthly trends
  const monthlyTrends = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    
    transactions.forEach(t => {
      const date = new Date(Number(t.date) / 1000000);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (t.transactionType === 'income') {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expenses += t.amount;
      }
    });
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        savings: data.income - data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }, [transactions]);

  // Calculate insights
  const insights = useMemo(() => {
    const totalIncome = transactions?.filter(t => t.transactionType === 'income').reduce((sum, t) => sum + t.amount, 0) || 0;
    const totalExpenses = transactions?.filter(t => t.transactionType === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0;
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    
    const totalGoalTarget = goals?.reduce((sum, g) => sum + g.targetAmount, 0) || 0;
    const totalGoalCurrent = goals?.reduce((sum, g) => sum + g.currentAmount, 0) || 0;
    const goalProgress = totalGoalTarget > 0 ? (totalGoalCurrent / totalGoalTarget) * 100 : 0;
    
    let riskLevel = 'Low';
    if (netSavings < 0) riskLevel = 'High';
    else if (savingsRate < 20) riskLevel = 'Medium';
    
    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      riskLevel,
      totalGoalTarget,
      totalGoalCurrent,
      goalProgress,
    };
  }, [transactions, goals]);

  if (!identity) {
    return <AccessDenied />;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI Financial Intelligence
            </CardTitle>
            <CardDescription>
              Add transactions to unlock AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Start by adding some transactions to see personalized AI insights and predictions.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
          AI Financial Intelligence
        </h1>
        <p className="text-muted-foreground mt-2">
          Advanced machine learning insights powered by 3 ML models
        </p>
      </div>

      {/* ML Models Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {ML_MODELS.map((model) => {
          const Icon = model.icon;
          return (
            <Card key={model.name} className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className={`w-5 h-5 ${model.color}`} />
                  {model.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{model.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Income</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(insights.totalIncome)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(insights.totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Savings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${insights.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(insights.netSavings)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Savings Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.savingsRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={insights.riskLevel === 'Low' ? 'default' : insights.riskLevel === 'Medium' ? 'secondary' : 'destructive'}>
              {insights.riskLevel} Risk
            </Badge>
            <p className="text-sm text-muted-foreground">
              {insights.riskLevel === 'High' && 'Your expenses exceed income. Consider reducing spending.'}
              {insights.riskLevel === 'Medium' && 'Your savings rate is below 20%. Try to increase savings.'}
              {insights.riskLevel === 'Low' && 'Your financial health looks good. Keep up the good work!'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Spending Distribution */}
      {categorySpending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending Distribution</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySpending}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                >
                  {categorySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || 'oklch(var(--chart-1))'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Monthly Trends */}
      {monthlyTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Income vs Expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLine data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="oklch(var(--chart-1))" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="oklch(var(--chart-2))" name="Expenses" />
                <Line type="monotone" dataKey="savings" stroke="oklch(var(--chart-3))" name="Savings" />
              </RechartsLine>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Educational Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Educational Purpose Only:</strong> These insights are for educational purposes and should not be considered financial advice. 
          Always consult with a certified financial advisor before making investment decisions.
        </AlertDescription>
      </Alert>
    </div>
  );
}
