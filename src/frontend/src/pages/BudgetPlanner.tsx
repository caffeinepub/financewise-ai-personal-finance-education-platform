import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';
import { useGetUserTransactions } from '../hooks/useQueries';
import { useCurrency } from '../hooks/useCurrency';
import { toast } from 'sonner';

type BudgetMode = 'student' | 'professional';

interface BudgetPlan {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsPercentage: number;
  categoryAllocations: { category: string; amount: number; percentage: number }[];
  emergencyFund: {
    target: number;
    current: number;
    progress: number;
  };
  healthScore: number;
  recommendations: string[];
}

export default function BudgetPlanner() {
  const { data: transactions = [] } = useGetUserTransactions();
  const { format } = useCurrency();
  const [mode, setMode] = useState<BudgetMode>('professional');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBudgetPlan = () => {
    const income = Number(monthlyIncome);
    
    if (!income || income <= 0) {
      toast.error('Please enter a valid monthly income');
      return;
    }

    setIsGenerating(true);

    // Simulate AI analysis
    setTimeout(() => {
      // Analyze user's spending patterns from transactions
      const expenses = transactions
        .filter((t: any) => t.transactionType === 'expense')
        .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

      const categoryMap = new Map<string, number>();
      transactions
        .filter((t: any) => t.transactionType === 'expense')
        .forEach((t: any) => {
          const current = categoryMap.get(t.category) || 0;
          categoryMap.set(t.category, current + (Number(t.amount) || 0));
        });

      // Generate budget allocations based on mode
      const allocations = mode === 'student' 
        ? [
            { category: 'Housing', percentage: 18 },
            { category: 'Food', percentage: 13 },
            { category: 'Groceries', percentage: 12 },
            { category: 'Transportation', percentage: 8 },
            { category: 'Books & Education', percentage: 6 },
            { category: 'Technology', percentage: 6 },
            { category: 'Medical', percentage: 6 },
            { category: 'Personal Care', percentage: 5 },
            { category: 'Entertainment', percentage: 4 },
            { category: 'Shopping', percentage: 3 },
            { category: 'Savings', percentage: 19 },
          ]
        : [
            { category: 'Housing', percentage: 18 },
            { category: 'Groceries', percentage: 12 },
            { category: 'Food', percentage: 10 },
            { category: 'Transportation', percentage: 10 },
            { category: 'Technology', percentage: 8 },
            { category: 'Medical', percentage: 7 },
            { category: 'Entertainment', percentage: 6 },
            { category: 'Shopping', percentage: 6 },
            { category: 'Personal Care', percentage: 2 },
            { category: 'Savings', percentage: 21 },
          ];

      const categoryAllocations = allocations.map(a => ({
        category: a.category,
        amount: (income * a.percentage) / 100,
        percentage: a.percentage,
      }));

      const savingsAllocation = categoryAllocations.find(c => c.category === 'Savings');
      const savings = savingsAllocation?.amount || 0;
      const savingsPercentage = savingsAllocation?.percentage || 0;
      const totalExpenses = income - savings;

      // Calculate emergency fund (3-6 months of expenses)
      const emergencyFundTarget = totalExpenses * 4;
      const currentSavings = transactions
        .filter((t: any) => t.transactionType === 'income')
        .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0) - expenses;

      // Calculate health score
      const healthScore = Math.min(100, Math.max(0, 
        (savingsPercentage * 2) + 
        (currentSavings > 0 ? 20 : 0) + 
        (transactions.length > 10 ? 20 : 10)
      ));

      // Generate recommendations
      const recommendations: string[] = [];
      if (savingsPercentage < 20) {
        recommendations.push('Consider increasing your savings rate to at least 20% of income');
      }
      if (currentSavings < emergencyFundTarget * 0.5) {
        recommendations.push('Build your emergency fund to cover 3-6 months of expenses');
      }
      if (categoryMap.size < 3) {
        recommendations.push('Track expenses in more categories for better budget insights');
      }
      recommendations.push('Review and adjust your budget monthly based on actual spending');

      const plan: BudgetPlan = {
        totalIncome: income,
        totalExpenses,
        savings,
        savingsPercentage,
        categoryAllocations,
        emergencyFund: {
          target: emergencyFundTarget,
          current: Math.max(0, currentSavings),
          progress: Math.min(100, (Math.max(0, currentSavings) / emergencyFundTarget) * 100),
        },
        healthScore,
        recommendations,
      };

      setBudgetPlan(plan);
      setIsGenerating(false);
      toast.success('Budget plan generated successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Budget Planner</h1>
        <p className="text-muted-foreground">Generate a personalized budget plan based on your income and spending patterns</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Configuration</CardTitle>
          <CardDescription>Select your profile and enter your monthly income</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Budget Mode</Label>
            <Select value={mode} onValueChange={(value) => setMode(value as BudgetMode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Monthly Income</Label>
            <Input
              id="income"
              type="number"
              placeholder="Enter your monthly income"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
            />
          </div>

          <Button 
            onClick={generateBudgetPlan}
            disabled={isGenerating || !monthlyIncome}
            className="w-full bg-gradient-to-r from-primary to-chart-1"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2"></div>
                Analyzing Your Finances...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Budget Plan AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {budgetPlan && (
        <>
          {/* Health Score */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Score</CardTitle>
              <CardDescription>Overall assessment of your budget plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">{budgetPlan.healthScore}/100</span>
                <div className={`px-4 py-2 rounded-full ${
                  budgetPlan.healthScore >= 80 ? 'bg-green-500/20 text-green-700' :
                  budgetPlan.healthScore >= 60 ? 'bg-yellow-500/20 text-yellow-700' :
                  'bg-red-500/20 text-red-700'
                }`}>
                  {budgetPlan.healthScore >= 80 ? 'Excellent' :
                   budgetPlan.healthScore >= 60 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
              <Progress value={budgetPlan.healthScore} className="h-3" />
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <p className="text-2xl font-bold text-green-600">{format(budgetPlan.totalIncome)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <p className="text-2xl font-bold text-orange-600">{format(budgetPlan.totalExpenses)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  <p className="text-2xl font-bold text-blue-600">{format(budgetPlan.savings)}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{budgetPlan.savingsPercentage}% of income</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Allocations */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocations</CardTitle>
              <CardDescription>Recommended spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetPlan.categoryAllocations.map((allocation) => (
                  <div key={allocation.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{allocation.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(allocation.amount)} ({allocation.percentage}%)
                      </span>
                    </div>
                    <Progress value={allocation.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Fund */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Fund Progress</CardTitle>
              <CardDescription>Target: 3-6 months of expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Progress</span>
                <span className="text-sm text-muted-foreground">
                  {format(budgetPlan.emergencyFund.current)} / {format(budgetPlan.emergencyFund.target)}
                </span>
              </div>
              <Progress value={budgetPlan.emergencyFund.progress} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {budgetPlan.emergencyFund.progress < 100 
                  ? `You need ${format(budgetPlan.emergencyFund.target - budgetPlan.emergencyFund.current)} more to reach your emergency fund goal`
                  : 'Congratulations! You have reached your emergency fund goal'}
              </p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Personalized tips to improve your financial health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {budgetPlan.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                    <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
