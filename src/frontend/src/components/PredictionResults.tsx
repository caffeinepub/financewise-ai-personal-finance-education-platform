import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, X } from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PredictionResultsProps {
  transactions: any[];
  goals: any[];
  onClose: () => void;
}

interface MonthlyProjection {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export default function PredictionResults({ transactions, goals, onClose }: PredictionResultsProps) {
  const { format } = useCurrency();

  // Calculate predictions based on transaction history
  const calculatePredictions = () => {
    if (transactions.length === 0) {
      return {
        futureSavings: 0,
        futureExpenses: 0,
        monthlyProjections: [] as MonthlyProjection[],
        riskLevel: 'low',
        confidence: 0,
      };
    }

    // Calculate average monthly income and expenses
    const income = transactions
      .filter((t: any) => t.transactionType === 'income')
      .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

    const expenses = transactions
      .filter((t: any) => t.transactionType === 'expense')
      .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

    const avgMonthlyIncome = income / Math.max(1, transactions.filter((t: any) => t.transactionType === 'income').length);
    const avgMonthlyExpenses = expenses / Math.max(1, transactions.filter((t: any) => t.transactionType === 'expense').length);

    // Generate 3-month projections
    const monthlyProjections: MonthlyProjection[] = [];
    let cumulativeSavings = income - expenses;

    for (let i = 1; i <= 3; i++) {
      const projectedIncome = avgMonthlyIncome * i;
      const projectedExpenses = avgMonthlyExpenses * i;
      cumulativeSavings = projectedIncome - projectedExpenses;

      monthlyProjections.push({
        month: `Month ${i}`,
        income: projectedIncome,
        expenses: projectedExpenses,
        savings: cumulativeSavings,
      });
    }

    // Determine risk level
    const savingsRate = (avgMonthlyIncome - avgMonthlyExpenses) / avgMonthlyIncome;
    let riskLevel = 'low';
    if (savingsRate < 0.1) riskLevel = 'high';
    else if (savingsRate < 0.2) riskLevel = 'medium';

    // Calculate confidence score
    const confidence = Math.min(95, 50 + (transactions.length * 2));

    return {
      futureSavings: cumulativeSavings,
      futureExpenses: avgMonthlyExpenses * 3,
      monthlyProjections,
      riskLevel,
      confidence,
    };
  };

  const predictions = calculatePredictions();

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Financial Predictions</CardTitle>
            <CardDescription>AI-powered forecast for the next 3 months based on your transaction history</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projected Savings (3 months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-5 w-5 ${predictions.futureSavings > 0 ? 'text-green-500' : 'text-red-500'}`} />
                <p className={`text-2xl font-bold ${predictions.futureSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {format(predictions.futureSavings)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expected Expenses (3 months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-orange-500" />
                <p className="text-2xl font-bold text-orange-600">{format(predictions.futureExpenses)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5 ${
                  predictions.riskLevel === 'high' ? 'text-red-500' :
                  predictions.riskLevel === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`} />
                <p className={`text-2xl font-bold capitalize ${
                  predictions.riskLevel === 'high' ? 'text-red-600' :
                  predictions.riskLevel === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {predictions.riskLevel}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Projections Chart */}
        <Card>
          <CardHeader>
            <CardTitle>3-Month Financial Forecast</CardTitle>
            <CardDescription>Projected income, expenses, and savings trajectory</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictions.monthlyProjections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => format(value)} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} name="Savings" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
            <CardDescription>Detailed projection for each month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={predictions.monthlyProjections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => format(value)} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Prediction Disclaimer</p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                These predictions are based on your historical transaction data and use statistical analysis. 
                Actual results may vary significantly. Confidence level: {predictions.confidence}%. 
                This is for educational purposes only and should not be considered financial advice.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
