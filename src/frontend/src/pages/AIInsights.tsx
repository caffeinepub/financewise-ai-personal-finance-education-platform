import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserPreferences, useGetUserTransactions, useGetBalance, useGetUserSavingsGoals, useTrainAIModel, useMakeAIPrediction } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, AlertTriangle, DollarSign, Target, Info, TrendingDown, Sparkles, Brain, LineChart, Cpu, Zap } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import AccessDenied from '../components/AccessDenied';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLine, Line, PieChart, Pie, Legend } from 'recharts';
import { useCurrency } from '../hooks/useCurrency';
import { toast } from 'sonner';

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
  const trainAIModel = useTrainAIModel();
  const makeAIPrediction = useMakeAIPrediction();
  const { format: formatCurrency, symbol: currencySymbol } = useCurrency();
  
  const [mlPrediction, setMlPrediction] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

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

  // Train ML model with user data
  const handleTrainModel = async () => {
    if (!transactions || transactions.length === 0) {
      toast.error('Need transaction data to train the model');
      return;
    }

    setIsTraining(true);
    try {
      const categoryDist = categorySpending.map(cat => [cat.name, BigInt(Math.floor(cat.value))] as [string, bigint]);
      
      await trainAIModel.mutateAsync({
        transactionAmountSum: insights.totalExpenses,
        numTransactions: BigInt(transactions.length),
        expenseCategoryDist: categoryDist,
        savingsProgressSum: insights.netSavings,
        savingsGoalCount: BigInt(goals?.length || 0),
        quizCorrectAnswers: BigInt(0),
        quizNumQuestions: BigInt(0),
      });
      
      toast.success('ML models trained successfully with your financial data!');
    } catch (error: any) {
      console.error('Failed to train model:', error);
      toast.error('Failed to train ML models');
    } finally {
      setIsTraining(false);
    }
  };

  // Make ML prediction
  const handleMakePrediction = async () => {
    if (!transactions || transactions.length === 0) {
      toast.error('Need transaction data to make predictions');
      return;
    }

    setIsPredicting(true);
    try {
      const categoryDist = categorySpending.map(cat => [cat.name, BigInt(Math.floor(cat.value))] as [string, bigint]);
      
      const prediction = await makeAIPrediction.mutateAsync({
        transactionAmountSum: insights.totalExpenses,
        numTransactions: BigInt(transactions.length),
        expenseCategoryDist: categoryDist,
        savingsProgressSum: insights.netSavings,
        savingsGoalCount: BigInt(goals?.length || 0),
        quizCorrectAnswers: BigInt(0),
        quizNumQuestions: BigInt(0),
      });
      
      setMlPrediction(prediction);
      toast.success('ML prediction generated successfully!');
    } catch (error: any) {
      console.error('Failed to make prediction:', error);
      toast.error('Failed to generate ML prediction');
    } finally {
      setIsPredicting(false);
    }
  };

  // Auto-train model when sufficient data is available
  useEffect(() => {
    if (transactions && transactions.length >= 5 && !mlPrediction && !isTraining && !isPredicting) {
      handleTrainModel();
    }
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{payload[0].payload.name || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!identity) {
    return <AccessDenied />;
  }

  const riskLevelColor = insights.riskLevel === 'High' ? 'destructive' : insights.riskLevel === 'Medium' ? 'secondary' : 'default';

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <Brain className="w-8 h-8 text-primary animate-pulse" />
                AI Financial Intelligence
              </h1>
              <p className="text-muted-foreground mt-2">Advanced machine learning insights powered by Linear Regression, GRU, and LSTM models analyzing your financial data.</p>
            </div>
          </div>
        </div>

        {/* Educational Disclaimer */}
        <Alert className="border-primary/50 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Educational Disclaimer:</strong> All AI insights are estimates for educational purposes only and are not financial advice. Consult a certified financial advisor before making financial decisions.
          </AlertDescription>
        </Alert>

        {!transactions || transactions.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center space-y-4">
                <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Transaction Data Available</h3>
                  <p className="text-muted-foreground mb-6">
                    Start adding transactions to get AI-powered financial insights and predictions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Advanced ML Models Section */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Advanced Machine Learning Models
                </CardTitle>
                <CardDescription>
                  3 specialized ML algorithms working together for enhanced financial predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ML_MODELS.map((model, idx) => {
                    const Icon = model.icon;
                    return (
                      <div key={idx} className="p-4 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-5 h-5 ${model.color}`} />
                          <p className="text-sm font-semibold">{model.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{model.desc}</p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <Button
                    onClick={handleTrainModel}
                    disabled={isTraining || transactions.length < 5}
                    className="gap-2"
                  >
                    {isTraining ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                        Training Models...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Train ML Models
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleMakePrediction}
                    disabled={isPredicting || transactions.length < 5}
                    variant="secondary"
                    className="gap-2"
                  >
                    {isPredicting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Predicting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Prediction
                      </>
                    )}
                  </Button>
                </div>
                
                {transactions.length < 5 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Add at least 5 transactions to enable ML predictions
                    </AlertDescription>
                  </Alert>
                )}

                {mlPrediction && (
                  <div className="mt-4 p-4 bg-background/50 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      ML Prediction Results
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-3 bg-chart-2/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Predicted Balance</p>
                        <p className="text-xl font-bold text-chart-2">
                          {formatCurrency(mlPrediction.balancePrediction)}
                        </p>
                      </div>
                      <div className="p-3 bg-chart-1/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Future Savings</p>
                        <p className="text-xl font-bold text-chart-1">
                          {formatCurrency(mlPrediction.futureSavings)}
                        </p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                        <Badge variant={mlPrediction.riskLevel === 'High' ? 'destructive' : 'default'}>
                          {mlPrediction.riskLevel}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3" />
                      <span>Confidence: {(mlPrediction.confidenceScore * 100).toFixed(0)}%</span>
                      <span>•</span>
                      <span>Updated: {new Date(Number(mlPrediction.lastUpdated) / 1000000).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Algorithm Explanations */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Linear Regression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Analyzes linear relationships in your financial data to predict future trends based on historical patterns. Ideal for identifying consistent spending and saving behaviors.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-teal-500/20 bg-gradient-to-br from-teal-500/5 to-teal-500/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4 text-teal-500" />
                    GRU (Gated Recurrent Unit)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Efficiently processes sequential financial data with gated mechanisms to capture short to medium-term patterns in your income and expenses over time.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-violet-500/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-violet-500" />
                    LSTM (Long Short-Term Memory)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Captures complex long-term dependencies in your financial behavior, remembering important patterns from months ago to make accurate future predictions.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-chart-2/20 bg-gradient-to-br from-chart-2/5 to-chart-2/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-chart-2" />
                    Net Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${insights.netSavings >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                    {formatCurrency(insights.netSavings)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total income minus expenses
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-chart-1/20 bg-gradient-to-br from-chart-1/5 to-chart-1/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-chart-1" />
                    Savings Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-1">
                    {insights.savingsRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Percentage of income saved
                  </p>
                </CardContent>
              </Card>

              <Card className={`border-2 ${riskLevelColor === 'destructive' ? 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10' : 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${riskLevelColor === 'destructive' ? 'text-destructive' : 'text-primary'}`} />
                    Financial Risk Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Badge variant={riskLevelColor} className="text-lg px-4 py-2">
                      {insights.riskLevel}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {insights.riskLevel === 'Low' && 'Your spending is well-managed'}
                    {insights.riskLevel === 'Medium' && 'Monitor your spending patterns'}
                    {insights.riskLevel === 'High' && 'Consider reducing expenses'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Spending Distribution */}
            <Card className="border-2 border-chart-3/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-chart-3" />
                  Spending Distribution by Category
                </CardTitle>
                <CardDescription>
                  Breakdown of your expenses across different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categorySpending.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categorySpending}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categorySpending.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || 'oklch(var(--primary))'} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="space-y-3">
                      {categorySpending.map((cat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: CATEGORY_COLORS[cat.name] || 'oklch(var(--primary))' }} />
                            <span className="font-medium">{cat.name}</span>
                          </div>
                          <span className="font-bold">{formatCurrency(cat.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No spending data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            {monthlyTrends.length > 0 && (
              <Card className="border-2 border-chart-5/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-chart-5" />
                    Monthly Financial Trends
                  </CardTitle>
                  <CardDescription>
                    Track your income, expenses, and savings over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLine data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                      <XAxis dataKey="month" stroke="oklch(var(--muted-foreground))" />
                      <YAxis stroke="oklch(var(--muted-foreground))" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="oklch(var(--chart-2))" strokeWidth={2} name="Income" />
                      <Line type="monotone" dataKey="expenses" stroke="oklch(var(--chart-4))" strokeWidth={2} name="Expenses" />
                      <Line type="monotone" dataKey="savings" stroke="oklch(var(--chart-1))" strokeWidth={2} name="Savings" />
                    </RechartsLine>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Financial Health Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Health Metrics</CardTitle>
                <CardDescription>Key indicators of your financial well-being</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Savings Rate</span>
                    <span className="text-muted-foreground">{insights.savingsRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-chart-2 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, insights.savingsRate)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Percentage of income you're saving
                  </p>
                </div>

                {goals && goals.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Goal Progress</span>
                      <span className="text-muted-foreground">{insights.goalProgress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-chart-1 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, insights.goalProgress)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Progress towards your savings goals
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Current Balance</span>
                  </div>
                  <div className={`text-2xl font-bold ${(balance || 0) >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                    {formatCurrency(balance || 0)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights & Recommendations */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 border-chart-2/20 bg-gradient-to-br from-chart-2/5 to-chart-2/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-chart-2" />
                    Insights
                  </CardTitle>
                  <CardDescription>Based on your financial patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {insights.savingsRate >= 20 ? (
                    <div className="p-4 rounded-lg bg-background/50 border border-chart-2/30">
                      <p className="font-medium text-sm mb-2 text-chart-2">✓ Great Savings Habit</p>
                      <p className="text-sm text-muted-foreground">
                        You're saving {insights.savingsRate.toFixed(1)}% of your income. Keep up the excellent work!
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-background/50 border border-primary/30">
                      <p className="font-medium text-sm mb-2 text-primary">💡 Savings Opportunity</p>
                      <p className="text-sm text-muted-foreground">
                        Consider increasing your savings rate to at least 20% of your income for better financial security.
                      </p>
                    </div>
                  )}
                  
                  {categorySpending.length > 0 && (
                    <div className="p-4 rounded-lg bg-background/50 border border-chart-1/30">
                      <p className="font-medium text-sm mb-2">Top Spending Category</p>
                      <p className="text-sm text-muted-foreground">
                        {categorySpending[0].name}: {formatCurrency(categorySpending[0].value)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={`border-2 ${insights.riskLevel === 'High' ? 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10' : 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${insights.riskLevel === 'High' ? 'text-destructive' : 'text-primary'}`} />
                    Recommendations
                  </CardTitle>
                  <CardDescription>Actions to improve your financial health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {insights.riskLevel === 'High' ? (
                    <>
                      <div className="p-4 rounded-lg bg-background/50 border border-destructive/30">
                        <p className="font-medium text-sm mb-2 text-destructive">⚠️ High Risk Alert</p>
                        <p className="text-sm text-muted-foreground">
                          Your expenses exceed your income. Review your spending and identify areas to cut back immediately.
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Consider creating a strict budget and tracking every expense for the next month.
                      </p>
                    </>
                  ) : insights.riskLevel === 'Medium' ? (
                    <>
                      <div className="p-4 rounded-lg bg-background/50 border border-primary/30">
                        <p className="font-medium text-sm mb-2 text-primary">⚡ Moderate Risk</p>
                        <p className="text-sm text-muted-foreground">
                          Your spending patterns show some areas of concern. Monitor your expenses closely.
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Focus on maintaining your current savings rate and avoid unnecessary expenses.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-lg bg-background/50 border border-primary/30">
                        <p className="font-medium text-sm mb-2 text-primary">✅ Low Risk</p>
                        <p className="text-sm text-muted-foreground">
                          Your spending is well-managed. Keep up the good work!
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Continue your current financial habits and look for opportunities to increase savings.
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Category Recommendations */}
            {categorySpending.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Category Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of your spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categorySpending.map((cat, index) => {
                      const percentage = (cat.value / insights.totalExpenses) * 100;
                      const isHigh = percentage > 30;
                      
                      return (
                        <div 
                          key={index} 
                          className={`flex items-start gap-3 p-4 rounded-lg border ${
                            isHigh
                              ? 'bg-destructive/5 border-destructive/20' 
                              : 'bg-chart-2/5 border-chart-2/20'
                          }`}
                        >
                          {isHigh ? (
                            <TrendingDown className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                          ) : (
                            <Lightbulb className="w-5 h-5 text-chart-2 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{cat.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {isHigh 
                                ? `This category represents ${percentage.toFixed(1)}% of your expenses. Consider reducing spending here.`
                                : `${percentage.toFixed(1)}% of total expenses - within normal range.`
                              }
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Amount: {formatCurrency(cat.value)}</span>
                              <span>Share: {percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
