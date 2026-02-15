import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserTransactions, useAddTransaction, useGetCategoryData, useGetFinancialTrends } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, DollarSign, Calendar, PlusCircle, TrendingDown, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import AccessDenied from '../components/AccessDenied';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
import type { Transaction } from '../types/transaction';
import { toast } from 'sonner';
import { useCurrency } from '../hooks/useCurrency';

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
  const { format } = useCurrency();

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
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
    const totalIncome = monthTransactions
      .filter(t => t.transactionType === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
    const remainingBalance = totalIncome - totalSpending;
    
    const todaySpending = monthTransactions
      .filter(t => {
        if (t.transactionType !== 'expense') return false;
        const txDate = new Date(Number(t.date) / 1000000).toDateString();
        const today = new Date().toDateString();
        return txDate === today;
      })
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return { 
      totalSpending: totalSpending || 0, 
      totalIncome: totalIncome || 0, 
      remainingBalance: remainingBalance || 0, 
      todaySpending: todaySpending || 0 
    };
  }, [transactions]);

  const expenseCategoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    transactions.forEach(t => {
      if (t.transactionType === 'expense') {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + (Number(t.amount) || 0));
      }
    });
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value: value || 0,
      fill: CATEGORY_COLORS[name] || 'oklch(var(--chart-1))',
    }));
  }, [transactions]);

  const incomeCategoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    transactions.forEach(t => {
      if (t.transactionType === 'income') {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + (Number(t.amount) || 0));
      }
    });
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value: value || 0,
      fill: CATEGORY_COLORS[name] || 'oklch(var(--chart-2))',
    }));
  }, [transactions]);

  if (!identity) {
    return <AccessDenied />;
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expenseAmount || !expenseCategory || !expensePaymentType) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const dateMs = new Date(expenseDate).getTime();
      
      await addTransaction.mutateAsync({
        amount,
        category: expenseCategory,
        notes: expenseNote,
        date: dateMs * 1000000,
        paymentType: expensePaymentType,
        user: identity.getPrincipal(),
        transactionType: 'expense',
      });

      setExpenseAmount('');
      setExpenseCategory('');
      setExpenseNote('');
      setExpensePaymentType('');
      setExpenseDate(new Date().toISOString().split('T')[0]);
      
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Failed to add expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!incomeAmount || !incomeCategory || !incomePaymentType) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(incomeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const dateMs = new Date(incomeDate).getTime();
      
      await addTransaction.mutateAsync({
        amount,
        category: incomeCategory,
        notes: incomeNote,
        date: dateMs * 1000000,
        paymentType: incomePaymentType,
        user: identity.getPrincipal(),
        transactionType: 'income',
      });

      setIncomeAmount('');
      setIncomeCategory('');
      setIncomeNote('');
      setIncomePaymentType('');
      setIncomeDate(new Date().toISOString().split('T')[0]);
      
      toast.success('Income added successfully');
    } catch (error) {
      console.error('Failed to add income:', error);
      toast.error('Failed to add income');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Financial Analytics</h1>
          <p className="text-muted-foreground">Track your income and expenses with detailed insights</p>
        </div>

        {/* Monthly Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{format(monthlyStats.totalIncome)}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{format(monthlyStats.totalSpending)}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyStats.remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {format(monthlyStats.remainingBalance)}
              </div>
              <p className="text-xs text-muted-foreground">Income - Expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Spending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{format(monthlyStats.todaySpending)}</div>
              <p className="text-xs text-muted-foreground">Current day</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction Forms */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Add Expense Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Add Expense
              </CardTitle>
              <CardDescription>Record a new expense transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-amount">Amount *</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    required
                    disabled={addTransaction.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-category">Category *</Label>
                  <Select value={expenseCategory} onValueChange={setExpenseCategory} disabled={addTransaction.isPending}>
                    <SelectTrigger id="expense-category">
                      <SelectValue placeholder="Select category" />
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
                  <Select value={expensePaymentType} onValueChange={setExpensePaymentType} disabled={addTransaction.isPending}>
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

                <div className="space-y-2">
                  <Label htmlFor="expense-date">Date</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    disabled={addTransaction.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-note">Note (Optional)</Label>
                  <Textarea
                    id="expense-note"
                    placeholder="Add a note..."
                    value={expenseNote}
                    onChange={(e) => setExpenseNote(e.target.value)}
                    disabled={addTransaction.isPending}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={addTransaction.isPending}>
                  {addTransaction.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Expense
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Add Income Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Add Income
              </CardTitle>
              <CardDescription>Record a new income transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddIncome} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="income-amount">Amount *</Label>
                  <Input
                    id="income-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    required
                    disabled={addTransaction.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income-category">Category *</Label>
                  <Select value={incomeCategory} onValueChange={setIncomeCategory} disabled={addTransaction.isPending}>
                    <SelectTrigger id="income-category">
                      <SelectValue placeholder="Select category" />
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
                  <Select value={incomePaymentType} onValueChange={setIncomePaymentType} disabled={addTransaction.isPending}>
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

                <div className="space-y-2">
                  <Label htmlFor="income-date">Date</Label>
                  <Input
                    id="income-date"
                    type="date"
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    disabled={addTransaction.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income-note">Note (Optional)</Label>
                  <Textarea
                    id="income-note"
                    placeholder="Add a note..."
                    value={incomeNote}
                    onChange={(e) => setIncomeNote(e.target.value)}
                    disabled={addTransaction.isPending}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={addTransaction.isPending}>
                  {addTransaction.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Income
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              {expenseCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => format(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Income Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Income Breakdown</CardTitle>
              <CardDescription>Distribution by source</CardDescription>
            </CardHeader>
            <CardContent>
              {incomeCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={incomeCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incomeCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => format(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No income data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Spending Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses (Last 30 Days)</CardTitle>
            <CardDescription>Daily comparison of your financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(value: any) => format(value)}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="oklch(var(--chart-2))" name="Income" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="oklch(var(--chart-1))" name="Expenses" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Category Insights</CardTitle>
            <CardDescription>Compare spending across categories</CardDescription>
          </CardHeader>
          <CardContent>
            {expenseCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: any) => format(value)}
                  />
                  <Bar dataKey="value" name="Amount">
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
