import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserTransactions, useGetUserSavingsGoals, useAddTransaction, useGetCategoryData, useGetMonthlyComparison, useGetFinancialTrends, useGetBalance } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, TrendingUp, TrendingDown, Target, PlusCircle, Wallet, ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import AccessDenied from '../components/AccessDenied';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line } from 'recharts';
import type { Transaction } from '../types/transaction';
import { toast } from 'sonner';

const EXPENSE_CATEGORIES = ['Entertainment', 'Housing & Utilities', 'Transportation', 'Shopping', 'Food & Dining', 'Healthcare', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'];
const PAYMENT_TYPES = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];

// Consistent color mapping for categories
const CATEGORY_COLORS: Record<string, string> = {
  'Entertainment': 'oklch(var(--chart-1))',
  'Housing & Utilities': 'oklch(var(--chart-2))',
  'Transportation': 'oklch(var(--chart-3))',
  'Shopping': 'oklch(var(--chart-4))',
  'Food & Dining': 'oklch(var(--chart-5))',
  'Healthcare': 'oklch(var(--chart-1))',
  'Salary': 'oklch(var(--chart-2))',
  'Freelance': 'oklch(var(--chart-3))',
  'Investment': 'oklch(var(--chart-4))',
  'Business': 'oklch(var(--chart-5))',
  'Gift': 'oklch(var(--chart-1))',
  'Other': 'oklch(var(--chart-5))',
};

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: transactions = [], isLoading: transactionsLoading } = useGetUserTransactions();
  const { data: goals = [], isLoading: goalsLoading } = useGetUserSavingsGoals();
  const { data: categoryData = [] } = useGetCategoryData();
  const { data: monthlyComparison = [] } = useGetMonthlyComparison();
  const { data: financialTrends = [] } = useGetFinancialTrends();
  const { data: balance = 0, isLoading: balanceLoading } = useGetBalance();
  const addTransaction = useAddTransaction();
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const stats = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;
    const monthMs = 30 * dayMs;

    let periodMs = weekMs;
    if (timePeriod === 'daily') periodMs = dayMs;
    if (timePeriod === 'monthly') periodMs = monthMs;

    const periodTransactions = transactions.filter(t => {
      const txDate = Number(t.date) / 1000000;
      return now - txDate < periodMs;
    });

    const totalSpend = periodTransactions
      .filter(t => t.transactionType === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalIncome = periodTransactions
      .filter(t => t.transactionType === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const categoryTotals: Record<string, number> = {};
    periodTransactions.forEach(t => {
      if (t.transactionType === 'expense') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    const categoryInsights = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0,
    })).sort((a, b) => b.amount - a.amount);

    const recentExpenses = [...transactions]
      .filter(t => t.transactionType === 'expense')
      .sort((a, b) => Number(b.date) - Number(a.date))
      .slice(0, 5);

    return {
      totalSpend,
      totalIncome,
      topCategory: topCategory ? topCategory[0] : 'None',
      categoryInsights,
      recentExpenses,
    };
  }, [transactions, timePeriod]);

  const chartData = stats.categoryInsights.map(item => ({
    name: item.category,
    value: item.amount,
  }));

  // Prepare pie chart data for expenses vs income
  const pieChartData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};
    const incomeByCategory: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.transactionType === 'expense') {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      } else {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
      }
    });

    const expenseData = Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value,
      type: 'expense',
    }));

    const incomeData = Object.entries(incomeByCategory).map(([name, value]) => ({
      name,
      value,
      type: 'income',
    }));

    return [...expenseData, ...incomeData];
  }, [transactions]);

  // Prepare monthly comparison bar chart data
  const barChartData = useMemo(() => {
    return monthlyComparison.slice(-6).map(item => ({
      month: item.month,
      expenses: item.expenses,
      income: item.income,
      savings: item.income - item.expenses,
    }));
  }, [monthlyComparison]);

  // Prepare financial trends line chart data
  const lineChartData = useMemo(() => {
    return financialTrends.slice(-30).map(item => ({
      date: new Date(Number(item.date) / 1000000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: item.balance,
      expenses: item.expenses,
      income: item.income,
    }));
  }, [financialTrends]);

  if (!identity) {
    return <AccessDenied />;
  }

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !paymentType) {
      toast.error('Error: Please enter all required fields (amount, category, payment type)');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Error: Please enter a valid amount greater than 0');
      return;
    }

    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amountNum,
      category,
      notes: note,
      date: BigInt(new Date(date).getTime() * 1000000),
      paymentType,
      user: identity.getPrincipal(),
      createdAt: BigInt(Date.now() * 1000000),
      transactionType,
    };

    addTransaction.mutate(transaction, {
      onSuccess: () => {
        setAmount('');
        setCategory('');
        setNote('');
        setPaymentType('');
        setDate(new Date().toISOString().split('T')[0]);
        setIsAddDialogOpen(false);
      },
    });
  };

  const categories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{payload[0].payload.name || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const balanceColor = balance >= 0 ? 'text-green-500' : 'text-red-500';
  const balanceIcon = balance >= 0 ? TrendingUp : TrendingDown;
  const BalanceIcon = balanceIcon;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Your financial overview at a glance.</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>Record a new income or expense transaction</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="space-y-2">
                  <Label>Transaction Type *</Label>
                  <Tabs value={transactionType} onValueChange={(v) => {
                    setTransactionType(v as 'income' | 'expense');
                    setCategory('');
                  }}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="expense">Expense</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="₹0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    placeholder="Add a note (optional)..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentType">Payment Type *</Label>
                    <Select value={paymentType} onValueChange={setPaymentType} required>
                      <SelectTrigger id="paymentType">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={addTransaction.isPending}>
                  {transactionType === 'expense' ? <TrendingDown className="w-4 h-4 mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                  {addTransaction.isPending ? 'Adding...' : `Add ${transactionType === 'expense' ? 'Expense' : 'Income'}`}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Real-Time Balance Tracker */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <span className="text-muted-foreground">Calculating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <BalanceIcon className={`w-8 h-8 ${balanceColor}`} />
                <div>
                  <div className={`text-4xl font-bold ${balanceColor}`}>
                    ₹{Math.abs(balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {balance >= 0 ? 'Positive balance' : 'Negative balance'} • Updates in real-time
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Period Selector */}
        <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as any)} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{stats.totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{stats.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Spending Category</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.topCategory}</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pie Chart - Expenses vs Income Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses vs Income by Category</CardTitle>
              <CardDescription>Distribution of your transactions across categories</CardDescription>
            </CardHeader>
            <CardContent>
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || 'oklch(var(--primary))'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  No transaction data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bar Chart - Monthly Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending & Savings</CardTitle>
              <CardDescription>Compare your income, expenses, and savings over time</CardDescription>
            </CardHeader>
            <CardContent>
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                    <XAxis dataKey="month" stroke="oklch(var(--muted-foreground))" />
                    <YAxis stroke="oklch(var(--muted-foreground))" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="expenses" fill="oklch(var(--destructive))" radius={[8, 8, 0, 0]} name="Expenses" />
                    <Bar dataKey="income" fill="oklch(var(--chart-2))" radius={[8, 8, 0, 0]} name="Income" />
                    <Bar dataKey="savings" fill="oklch(var(--chart-1))" radius={[8, 8, 0, 0]} name="Savings" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  No monthly comparison data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Line Graph - Financial Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Trends Over Time</CardTitle>
            <CardDescription>Track your balance growth and spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            {lineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                  <XAxis dataKey="date" stroke="oklch(var(--muted-foreground))" />
                  <YAxis stroke="oklch(var(--muted-foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="oklch(var(--chart-1))" strokeWidth={2} dot={{ fill: 'oklch(var(--chart-1))' }} name="Balance" />
                  <Line type="monotone" dataKey="income" stroke="oklch(var(--chart-2))" strokeWidth={2} dot={{ fill: 'oklch(var(--chart-2))' }} name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="oklch(var(--destructive))" strokeWidth={2} dot={{ fill: 'oklch(var(--destructive))' }} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                No financial trend data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Spending Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Spending</CardTitle>
            <CardDescription>Spending breakdown by category for the selected period.</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                  <XAxis dataKey="name" stroke="oklch(var(--muted-foreground))" />
                  <YAxis stroke="oklch(var(--muted-foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || 'oklch(var(--primary))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No spending data for this period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Category Insights</CardTitle>
            <CardDescription>Percentage of total spend per category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.categoryInsights.length > 0 ? (
              stats.categoryInsights.map((insight) => (
                <div key={insight.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[insight.category] || 'oklch(var(--primary))' }}
                      />
                      <span className="font-medium">{insight.category}</span>
                    </div>
                    <span className="text-muted-foreground">{insight.percentage}%</span>
                  </div>
                  <Progress value={insight.percentage} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No category data available</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Here are your last 5 transactions.</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate({ to: '/transactions' })}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentExpenses.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                  <div>Category</div>
                  <div>Note</div>
                  <div className="text-right">Amount</div>
                </div>
                {stats.recentExpenses.map((expense) => (
                  <div key={expense.id} className="grid grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[expense.category] || 'oklch(var(--primary))' }}
                      />
                      <span className="font-medium">{expense.category}</span>
                    </div>
                    <div className="text-muted-foreground truncate">{expense.notes}</div>
                    <div className="text-right font-semibold">
                      ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            )}
          </CardContent>
        </Card>

        {/* Smart Goals Tracking */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Smart Goals Tracking</CardTitle>
              <CardDescription>Your progress towards your financial goals.</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate({ to: '/goals' })}>
              <span className="mr-2">Manage Goals</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {goalsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : goals.length > 0 ? (
              goals.slice(0, 3).map((goal) => {
                const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{goal.name}</span>
                      </div>
                      <span className="text-sm font-medium">{Math.min(100, Math.round(progress))}%</span>
                    </div>
                    <Progress value={Math.min(100, progress)} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹{goal.currentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      <span>₹{goal.targetAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No savings goals yet</p>
                <Button onClick={() => navigate({ to: '/goals' })}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Your First Goal
                </Button>
              </div>
            )}
            {goals.length > 3 && (
              <div className="pt-4 border-t">
                <Button variant="ghost" className="w-full" onClick={() => navigate({ to: '/goals' })}>
                  View All {goals.length} Goals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
