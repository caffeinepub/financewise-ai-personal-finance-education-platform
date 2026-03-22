import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  BarChart2,
  Loader2,
  PieChartIcon,
  PlusCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import AccessDenied from "../components/AccessDenied";
import { useCurrency } from "../hooks/useCurrency";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddTransaction, useGetUserTransactions } from "../hooks/useQueries";

const EXPENSE_CATEGORIES = [
  "Entertainment",
  "Housing & Utilities",
  "Transportation",
  "Shopping",
  "Food & Dining",
  "Healthcare",
  "Other",
];
const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Gift",
  "Other",
];
const PAYMENT_TYPES = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Bank Transfer",
];

const EXPENSE_COLORS: Record<string, string> = {
  Entertainment: "#8b5cf6",
  "Housing & Utilities": "#06b6d4",
  Transportation: "#10b981",
  Shopping: "#f59e0b",
  "Food & Dining": "#ef4444",
  Healthcare: "#3b82f6",
  Other: "#6b7280",
};

const INCOME_COLORS: Record<string, string> = {
  Salary: "#10b981",
  Freelance: "#06b6d4",
  Investment: "#8b5cf6",
  Business: "#f59e0b",
  Gift: "#ec4899",
  Other: "#6b7280",
};

function EmptyChartState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
      <BarChart2 className="h-10 w-10 opacity-30" />
      <p className="text-sm">No {label} data yet. Add some entries above!</p>
    </div>
  );
}

export default function Analytics() {
  const { identity } = useInternetIdentity();
  const { data: transactions = [] } = useGetUserTransactions();
  const addTransaction = useAddTransaction();
  const { format, symbol } = useCurrency();

  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [expensePaymentType, setExpensePaymentType] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");
  const [incomeNote, setIncomeNote] = useState("");
  const [incomePaymentType, setIncomePaymentType] = useState("");
  const [incomeDate, setIncomeDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // --- Expense chart data ---
  const expensePieData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.transactionType === "expense")
        map.set(t.category, (map.get(t.category) || 0) + Number(t.amount));
    }
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      fill: EXPENSE_COLORS[name] || "#8884d8",
    }));
  }, [transactions]);

  const expenseBarData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.transactionType === "expense")
        map.set(t.category, (map.get(t.category) || 0) + Number(t.amount));
    }
    return Array.from(map.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        fill: EXPENSE_COLORS[category] || "#8884d8",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const expenseLineData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split("T")[0];
    });
    const daily: Record<string, number> = {};
    for (const t of transactions) {
      if (t.transactionType === "expense") {
        const d = new Date(Number(t.date) / 1_000_000)
          .toISOString()
          .split("T")[0];
        daily[d] = (daily[d] || 0) + Number(t.amount);
      }
    }
    return last30Days.map((date) => ({
      day: new Date(date).getDate().toString(),
      amount: daily[date] || 0,
    }));
  }, [transactions]);

  // --- Income chart data ---
  const incomePieData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.transactionType === "income")
        map.set(t.category, (map.get(t.category) || 0) + Number(t.amount));
    }
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      fill: INCOME_COLORS[name] || "#10b981",
    }));
  }, [transactions]);

  const incomeBarData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.transactionType === "income")
        map.set(t.category, (map.get(t.category) || 0) + Number(t.amount));
    }
    return Array.from(map.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        fill: INCOME_COLORS[category] || "#10b981",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const incomeLineData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split("T")[0];
    });
    const daily: Record<string, number> = {};
    for (const t of transactions) {
      if (t.transactionType === "income") {
        const d = new Date(Number(t.date) / 1_000_000)
          .toISOString()
          .split("T")[0];
        daily[d] = (daily[d] || 0) + Number(t.amount);
      }
    }
    return last30Days.map((date) => ({
      day: new Date(date).getDate().toString(),
      amount: daily[date] || 0,
    }));
  }, [transactions]);

  if (!identity) return <AccessDenied />;

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || !expenseCategory || !expensePaymentType) {
      toast.error("Please fill in all required fields");
      return;
    }
    const amount = Number.parseFloat(expenseAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      const dateMs = new Date(expenseDate).getTime();
      await addTransaction.mutateAsync({
        id: Date.now().toString(),
        amount,
        category: expenseCategory,
        notes: expenseNote,
        date: BigInt(dateMs * 1_000_000),
        paymentType: expensePaymentType,
        user: identity.getPrincipal(),
        transactionType: "expense",
        createdAt: BigInt(Date.now() * 1_000_000),
      });
      setExpenseAmount("");
      setExpenseCategory("");
      setExpenseNote("");
      setExpensePaymentType("");
      setExpenseDate(new Date().toISOString().split("T")[0]);
      toast.success("Expense added!");
    } catch {
      /* handled by mutation */
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeAmount || !incomeCategory || !incomePaymentType) {
      toast.error("Please fill in all required fields");
      return;
    }
    const amount = Number.parseFloat(incomeAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      const dateMs = new Date(incomeDate).getTime();
      await addTransaction.mutateAsync({
        id: Date.now().toString(),
        amount,
        category: incomeCategory,
        notes: incomeNote,
        date: BigInt(dateMs * 1_000_000),
        paymentType: incomePaymentType,
        user: identity.getPrincipal(),
        transactionType: "income",
        createdAt: BigInt(Date.now() * 1_000_000),
      });
      setIncomeAmount("");
      setIncomeCategory("");
      setIncomeNote("");
      setIncomePaymentType("");
      setIncomeDate(new Date().toISOString().split("T")[0]);
      toast.success("Income added!");
    } catch {
      /* handled by mutation */
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics</h1>
          <p className="text-muted-foreground">
            Visualize your financial data with detailed charts
          </p>
        </div>

        {/* Sliding Tabs */}
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="w-full max-w-sm mb-6 h-11">
            <TabsTrigger
              value="expenses"
              className="flex-1 gap-2 text-sm font-semibold"
            >
              <TrendingDown className="h-4 w-4 text-red-500" />
              Expenses Analytics
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="flex-1 gap-2 text-sm font-semibold"
            >
              <TrendingUp className="h-4 w-4 text-green-500" />
              Income Analytics
            </TabsTrigger>
          </TabsList>

          {/* ── EXPENSES TAB ── */}
          <TabsContent value="expenses" className="space-y-6 mt-0">
            {/* Add Expense Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Add Expense
                </CardTitle>
                <CardDescription>
                  Record a new expense transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleAddExpense}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount ({symbol}) *</Label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-muted-foreground text-sm pointer-events-none">
                        {symbol}
                      </span>
                      <Input
                        id="expense-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        required
                        disabled={addTransaction.isPending}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={expenseCategory}
                      onValueChange={setExpenseCategory}
                      disabled={addTransaction.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Type *</Label>
                    <Select
                      value={expensePaymentType}
                      onValueChange={setExpensePaymentType}
                      disabled={addTransaction.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      disabled={addTransaction.isPending}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label>Note (Optional)</Label>
                    <Textarea
                      placeholder="Add a note..."
                      value={expenseNote}
                      onChange={(e) => setExpenseNote(e.target.value)}
                      disabled={addTransaction.isPending}
                      className="resize-none h-10"
                    />
                  </div>
                  <div className="flex items-end sm:col-span-2 lg:col-span-3">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={addTransaction.isPending}
                    >
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
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Expense Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <PieChartIcon className="h-4 w-4 text-red-500" />
                    Expense by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {expensePieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={expensePieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {expensePieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => format(v)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChartState label="expense" />
                  )}
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart2 className="h-4 w-4 text-red-500" />
                    Expense Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {expenseBarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart
                        data={expenseBarData}
                        layout="vertical"
                        margin={{ left: 8, right: 16 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tickFormatter={(v) => format(v)}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis
                          type="category"
                          dataKey="category"
                          tick={{ fontSize: 11 }}
                          width={110}
                        />
                        <Tooltip formatter={(v: number) => format(v)} />
                        <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                          {expenseBarData.map((entry) => (
                            <Cell key={entry.category} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChartState label="expense" />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-red-500" />
                  30-Day Expense Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expenseLineData.some((d) => d.amount > 0) ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={expenseLineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis
                        tickFormatter={(v) => format(v)}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(v: number) => format(v)}
                        labelFormatter={(l) => `Day ${l}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#ef4444"
                        name="Expenses"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChartState label="expense trend" />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── INCOME TAB ── */}
          <TabsContent value="income" className="space-y-6 mt-0">
            {/* Add Income Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Add Income
                </CardTitle>
                <CardDescription>
                  Record a new income transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleAddIncome}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <div className="space-y-2">
                    <Label htmlFor="income-amount">Amount ({symbol}) *</Label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-muted-foreground text-sm pointer-events-none">
                        {symbol}
                      </span>
                      <Input
                        id="income-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={incomeAmount}
                        onChange={(e) => setIncomeAmount(e.target.value)}
                        required
                        disabled={addTransaction.isPending}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={incomeCategory}
                      onValueChange={setIncomeCategory}
                      disabled={addTransaction.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {INCOME_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Type *</Label>
                    <Select
                      value={incomePaymentType}
                      onValueChange={setIncomePaymentType}
                      disabled={addTransaction.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={incomeDate}
                      onChange={(e) => setIncomeDate(e.target.value)}
                      disabled={addTransaction.isPending}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label>Note (Optional)</Label>
                    <Textarea
                      placeholder="Add a note..."
                      value={incomeNote}
                      onChange={(e) => setIncomeNote(e.target.value)}
                      disabled={addTransaction.isPending}
                      className="resize-none h-10"
                    />
                  </div>
                  <div className="flex items-end sm:col-span-2 lg:col-span-3">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={addTransaction.isPending}
                    >
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
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Income Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <PieChartIcon className="h-4 w-4 text-green-500" />
                    Income by Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {incomePieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={incomePieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {incomePieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => format(v)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChartState label="income" />
                  )}
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart2 className="h-4 w-4 text-green-500" />
                    Income Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {incomeBarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart
                        data={incomeBarData}
                        layout="vertical"
                        margin={{ left: 8, right: 16 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tickFormatter={(v) => format(v)}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis
                          type="category"
                          dataKey="category"
                          tick={{ fontSize: 11 }}
                          width={80}
                        />
                        <Tooltip formatter={(v: number) => format(v)} />
                        <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                          {incomeBarData.map((entry) => (
                            <Cell key={entry.category} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChartState label="income" />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-green-500" />
                  30-Day Income Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {incomeLineData.some((d) => d.amount > 0) ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={incomeLineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis
                        tickFormatter={(v) => format(v)}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(v: number) => format(v)}
                        labelFormatter={(l) => `Day ${l}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#10b981"
                        name="Income"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChartState label="income trend" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
