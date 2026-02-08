import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserTransactions, useAddTransaction, useGetCategoryData, useGetFinancialTrends } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, DollarSign, Calendar, PlusCircle, TrendingDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import AccessDenied from '../components/AccessDenied';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
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

export default function Analytics() {
  const { identity } = useInternetIdentity();
  const { data: transactions = [] } = useGetUserTransactions();
  const { data: categoryData = [] } = useGetCategoryData();
  const { data: financialTrends = [] } = useGetFinancialTrends();
  const addTransaction = useAddTransaction();

  // Expense form state
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseNote, setExpenseNote] = useState('');
  const [expensePaymentType, setExpensePaymentType] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  // Income form state
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('');
  const [incomeNote, setIncomeNote] = useState('');
  const [incomePaymentType, setIncomePaymentType] = useState('');
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split('T')[0]);

  const spendingTrendData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const dailySpending: Record<string, number> = {};
    const dailyIncome: Record<string, number> = {};
    
    transactions.forEach(t => {
      const txDate = new Date(Number(t.date) / 1000000).toISOString().split('T')[0];
      if (t.transactionType === 'expense') {
        dailySpending[txDate] = (dailySpending[txDate] || 0) + t.amount;
      } else {
        dailyIncome[txDate] = (dailyIncome[txDate] || 0) + t.amount;
      }
    });

    return last30Days.map(date => ({
      date: new Date(date).getDate().toString(),
      expenses: dailySpending[date] || 0,
      income: dailyIncome[date] || 0,
    }));
  }, [transactions]);

  const monthlyStats = useMemo(() => {
    const now = Date.now();
    const monthMs = 30 * 24 * 60 * 60 * 1000;
    const monthTransactions = transactions.filter(t => {
      const txDate = Number(t.date) / 1000000;
      return now - txDate < monthMs;
    });

    const totalSpending = monthTransactions
      .filter(t => t.transactionType === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalIncome = monthTransactions
      .filter(t => t.transactionType === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const remainingBalance = totalIncome - totalSpending;
    
    const todaySpending = monthTransactions
      .filter(t => {
        if (t.transactionType !== 'expense') return false;
        const txDate = new Date(Number(t.date) / 1000000).toDateString();
        const today = new Date().toDateString();
        return txDate === today;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalSpending, totalIncome, remainingBalance, todaySpending };
  }, [transactions]);

  // Category breakdown for pie chart
  const categoryBreakdown = useMemo(() => {
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
      type: 'Expense',
    }));

    const incomeData = Object.entries(incomeByCategory).map(([name, value]) => ({
      name,
      value,
      type: 'Income',
    }));

    return { expenseData, incomeData };
  }, [transactions]);

  if (!identity) {
    return <AccessDenied />;
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!expenseAmount || !expenseCategory || !expensePaymentType) {
      toast.error('Error: Please enter all required fields (amount, category, payment type)');
      return;
    }

    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Error: Please enter a valid amount greater than 0');
      return;
    }

    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      category: expenseCategory,
      notes: expenseNote,
      date: BigInt(new Date(expenseDate).getTime() * 1000000),
      paymentType: expensePaymentType,
      user: identity.getPrincipal(),
      createdAt: BigInt(Date.now() * 1000000),
      transactionType: 'expense',
    };

    addTransaction.mutate(transaction, {
      onSuccess: () => {
        setExpenseAmount('');
        setExpenseCategory('');
        setExpenseNote('');
        setExpensePaymentType('');
        setExpenseDate(new Date().toISOString().split('T')[0]);
      },
    });
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!incomeAmount || !incomeCategory || !incomePaymentType) {
      toast.error('Error: Please enter all required fields (amount, category, payment type)');
      return;
    }

    const amount = parseFloat(incomeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Error: Please enter a valid amount greater than 0');
      return;
    }

    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      category: incomeCategory,
      notes: incomeNote,
      date: BigInt(new Date(incomeDate).getTime() * 1000000),
      paymentType: incomePaymentType,
      user: identity.getPrincipal(),
      createdAt: BigInt(Date.now() * 1000000),
      transactionType: 'income',
    };

    addTransaction.mutate(transaction, {
      onSuccess: () => {
        setIncomeAmount('');
        setIncomeCategory('');
        setIncomeNote('');
        setIncomePaymentType('');
        setIncomeDate(new Date().toISOString().split('T')[0]);
      },
    });
  };

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

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track and manage your income and expenses with detailed insights.</p>
        </div>

        {/* Smart Expense Input */}
        <Card>
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
            <CardDescription>Record a new expense transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-amount">Amount Spent *</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    step="0.01"
                    placeholder="₹0.00"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-date">Date *</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-note">Note</Label>
                <Textarea
                  id="expense-note"
                  placeholder="Add a note (optional)..."
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-category">Category *</Label>
                  <Select value={expenseCategory} onValueChange={setExpenseCategory} required>
                    <SelectTrigger id="expense-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-payment">Payment Type *</Label>
                  <Select value={expensePaymentType} onValueChange={setExpensePaymentType} required>
                    <SelectTrigger id="expense-payment">
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
                <TrendingDown className="w-4 h-4 mr-2" />
                {addTransaction.isPending ? 'Adding...' : 'Add Expense'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Income Input */}
        <Card>
          <CardHeader>
            <CardTitle>Add Income</CardTitle>
            <CardDescription>Record earned income and view your balance</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddIncome} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income-amount">Amount Earned *</Label>
                  <Input
                    id="income-amount"
                    type="number"
                    step="0.01"
                    placeholder="₹0.00"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income-date">Date *</Label>
                  <Input
                    id="income-date"
                    type="date"
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="income-note">Note</Label>
                <Textarea
                  id="income-note"
                  placeholder="e.g., Monthly salary, Freelance project..."
                  value={incomeNote}
                  onChange={(e) => setIncomeNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income-category">Category *</Label>
                  <Select value={incomeCategory} onValueChange={setIncomeCategory} required>
                    <SelectTrigger id="income-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income-payment">Payment Type *</Label>
                  <Select value={incomePaymentType} onValueChange={setIncomePaymentType} required>
                    <SelectTrigger id="income-payment">
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
                <PlusCircle className="w-4 h-4 mr-2" />
                {addTransaction.isPending ? 'Adding...' : 'Add Income'}
              </Button>
            </form>

            <div className="pt-6 mt-6 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Total Income</span>
                  <p className="text-2xl font-bold text-chart-2">₹{monthlyStats.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Remaining Balance</span>
                  <p className={`text-2xl font-bold ${monthlyStats.remainingBalance >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                    ₹{monthlyStats.remainingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Expense Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Category Breakdown</CardTitle>
              <CardDescription>Distribution of your expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryBreakdown.expenseData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown.expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryBreakdown.expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || 'oklch(var(--primary))'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Income Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Income Category Breakdown</CardTitle>
              <CardDescription>Distribution of your income by category</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryBreakdown.incomeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown.incomeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryBreakdown.incomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || 'oklch(var(--primary))'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  No income data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Income vs Expenses Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses Trend</CardTitle>
            <CardDescription>Daily comparison of your income and expenses over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={spendingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey="date" stroke="oklch(var(--muted-foreground))" />
                <YAxis stroke="oklch(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="oklch(var(--destructive))"
                  strokeWidth={2}
                  dot={{ fill: 'oklch(var(--destructive))' }}
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="oklch(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: 'oklch(var(--chart-2))' }}
                  name="Income"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Insights with Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category-Based Insights</CardTitle>
            <CardDescription>Compare spending across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryBreakdown.expenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                  <XAxis dataKey="name" stroke="oklch(var(--muted-foreground))" />
                  <YAxis stroke="oklch(var(--muted-foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Amount">
                    {categoryBreakdown.expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || 'oklch(var(--primary))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{monthlyStats.totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{monthlyStats.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Spending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{monthlyStats.todaySpending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
