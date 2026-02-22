import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Target, Sparkles } from 'lucide-react';
import { useGetBalance, useGetCategoryData, useGetUserTransactions, useGetSavingsGoals } from '../hooks/useQueries';
import { useCurrency } from '../hooks/useCurrency';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import PredictionResults from '../components/PredictionResults';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: balance = 0 } = useGetBalance();
  const { data: categoryData = [] } = useGetCategoryData();
  const { data: transactions = [] } = useGetUserTransactions();
  const { data: goals = [] } = useGetSavingsGoals();
  const { format } = useCurrency();
  const [showPredictions, setShowPredictions] = useState(false);
  const [isGeneratingPredictions, setIsGeneratingPredictions] = useState(false);

  // Calculate income and expenses
  const income = transactions
    .filter((t: any) => t.transactionType === 'income')
    .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

  const expenses = transactions
    .filter((t: any) => t.transactionType === 'expense')
    .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

  const savings = income - expenses;

  // Recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a: any, b: any) => Number(b.date) - Number(a.date))
    .slice(0, 5);

  // Prepare chart data
  const categoryChartData = categoryData.map((cat: any) => ({
    name: cat.category,
    value: cat.totalAmount,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const handleGeneratePredictions = () => {
    setIsGeneratingPredictions(true);
    // Simulate prediction generation
    setTimeout(() => {
      setIsGeneratingPredictions(false);
      setShowPredictions(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
        </div>
        <Button 
          onClick={handleGeneratePredictions}
          disabled={isGeneratingPredictions || transactions.length === 0}
          className="bg-gradient-to-r from-primary to-chart-1"
        >
          {isGeneratingPredictions ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Predict Future
            </>
          )}
        </Button>
      </div>

      {/* Balance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(balance)}</div>
            <p className="text-xs text-muted-foreground">Current account balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{format(income)}</div>
            <p className="text-xs text-muted-foreground">All-time income</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{format(expenses)}</div>
            <p className="text-xs text-muted-foreground">All-time expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{format(savings)}</div>
            <p className="text-xs text-muted-foreground">Income - Expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Results */}
      {showPredictions && (
        <PredictionResults 
          transactions={transactions}
          goals={goals}
          onClose={() => setShowPredictions(false)}
        />
      )}

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Your expense distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => format(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${transaction.transactionType === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-sm font-medium">{transaction.category}</p>
                        <p className="text-xs text-muted-foreground">{transaction.notes || 'No description'}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-semibold ${transaction.transactionType === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.transactionType === 'income' ? '+' : '-'}{format(transaction.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                  No transactions yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
          <CardDescription>Track your progress towards financial goals</CardDescription>
        </CardHeader>
        <CardContent>
          {goals.length > 0 ? (
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal: any) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{goal.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(goal.currentAmount)} / {format(goal.targetAmount)}
                      </p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-chart-1 transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/goals' })}>
                View All Goals
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No savings goals yet</p>
              <Button onClick={() => navigate({ to: '/goals' })}>Create Your First Goal</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
