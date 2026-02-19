import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, TrendingUp, AlertTriangle, Target, Sparkles, Brain, Calendar } from 'lucide-react';
import { useGetUserTransactions, useGetSavingsGoals } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { BudgetType, BudgetStatus } from '../backend';

type UserMode = 'student' | 'professional';

interface BudgetInputs {
  userMode: UserMode;
  monthlyIncome: number;
  rentOrEmi: number;
  food: number;
  travel: number;
  utilities: number;
  existingLoans: number;
  entertainment?: number;
  subscriptions?: number;
  shopping?: number;
  insurance?: number;
  investments?: number;
  emergencyFund: number;
}

interface SmartAllocation {
  category: string;
  recommended: number;
  explanation: string;
}

interface OverspendingAlert {
  category: string;
  budgeted: number;
  actual: number;
  excess: number;
  severity: 'warning' | 'critical';
}

export default function BudgetPlanner() {
  const { identity } = useInternetIdentity();
  const { data: transactions = [] } = useGetUserTransactions();
  const { data: goals = [] } = useGetSavingsGoals();

  const [inputs, setInputs] = useState<BudgetInputs>({
    userMode: 'professional',
    monthlyIncome: 0,
    rentOrEmi: 0,
    food: 0,
    travel: 0,
    utilities: 0,
    existingLoans: 0,
    emergencyFund: 0,
  });

  const [showResults, setShowResults] = useState(false);
  const [smartAllocations, setSmartAllocations] = useState<SmartAllocation[]>([]);
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [emergencyFundTarget, setEmergencyFundTarget] = useState(0);
  const [endOfMonthBalance, setEndOfMonthBalance] = useState(0);
  const [overspendingAlerts, setOverspendingAlerts] = useState<OverspendingAlert[]>([]);

  // Calculate progress
  const mandatoryFields: (keyof BudgetInputs)[] = ['monthlyIncome', 'rentOrEmi', 'food', 'travel', 'utilities', 'existingLoans'];
  const optionalFields: (keyof BudgetInputs)[] = ['entertainment', 'subscriptions', 'shopping', 'insurance', 'investments'];
  
  const mandatoryFilled = mandatoryFields.filter(field => {
    const value = inputs[field];
    return typeof value === 'number' && value > 0;
  }).length;
  
  const optionalFilled = optionalFields.filter(field => {
    const value = inputs[field];
    return typeof value === 'number' && value > 0;
  }).length;
  
  const progress = (mandatoryFilled / mandatoryFields.length) * 70 + (optionalFilled / optionalFields.length) * 30;

  const handleInputChange = (field: keyof BudgetInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: typeof value === 'string' ? value : value }));
  };

  const calculateBudget = () => {
    const totalMandatory = inputs.rentOrEmi + inputs.food + inputs.travel + inputs.utilities + inputs.existingLoans;
    const totalOptional = (inputs.entertainment || 0) + (inputs.subscriptions || 0) + (inputs.shopping || 0) + (inputs.insurance || 0) + (inputs.investments || 0);
    const totalExpenses = totalMandatory + totalOptional;
    const remainingAmount = inputs.monthlyIncome - totalExpenses;
    const savingsRate = inputs.monthlyIncome > 0 ? (remainingAmount / inputs.monthlyIncome) * 100 : 0;

    // Smart category allocations
    const allocations: SmartAllocation[] = [];
    const incomeLevel = inputs.monthlyIncome;

    if (inputs.userMode === 'student') {
      allocations.push(
        { category: 'Food', recommended: incomeLevel * 0.15, explanation: 'Students should allocate 15% for food and groceries' },
        { category: 'Transportation', recommended: incomeLevel * 0.10, explanation: 'Keep transport costs around 10% with student discounts' },
        { category: 'Books & Education', recommended: incomeLevel * 0.08, explanation: 'Invest 8% in educational materials' },
        { category: 'Savings', recommended: incomeLevel * 0.15, explanation: 'Try to save 15% even on a student budget' }
      );
    } else {
      allocations.push(
        { category: 'Housing', recommended: incomeLevel * 0.30, explanation: 'Housing should not exceed 30% of income' },
        { category: 'Food', recommended: incomeLevel * 0.15, explanation: 'Allocate 15% for groceries and dining' },
        { category: 'Transportation', recommended: incomeLevel * 0.10, explanation: 'Keep transport costs around 10%' },
        { category: 'Savings', recommended: incomeLevel * 0.20, explanation: 'Aim for 20% savings rate for financial health' },
        { category: 'Investments', recommended: incomeLevel * 0.10, explanation: 'Invest 10% for long-term wealth building' }
      );
    }

    setSmartAllocations(allocations);
    setSavingsPercentage(savingsRate);

    // Emergency fund calculation
    const monthlyExpenses = totalExpenses;
    const targetMonths = inputs.userMode === 'student' ? 3 : 6;
    const emergencyTarget = monthlyExpenses * targetMonths;
    setEmergencyFundTarget(emergencyTarget);

    // End of month balance prediction
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - currentDate.getDate();
    const dailySpendingRate = totalExpenses / daysInMonth;
    const projectedSpending = dailySpendingRate * daysRemaining;
    const predictedBalance = remainingAmount - projectedSpending;
    setEndOfMonthBalance(predictedBalance);

    // Overspending detection
    const alerts: OverspendingAlert[] = [];
    const expenseTransactions = transactions.filter(t => t.transactionType === 'expense');
    
    const categorySpending: Record<string, number> = {};
    expenseTransactions.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

    Object.entries(categorySpending).forEach(([category, actual]) => {
      const categoryLower = category.toLowerCase();
      let budgeted = 0;
      
      if (categoryLower.includes('food')) budgeted = inputs.food;
      else if (categoryLower.includes('travel') || categoryLower.includes('transport')) budgeted = inputs.travel;
      else if (categoryLower.includes('entertainment')) budgeted = inputs.entertainment || 0;
      else if (categoryLower.includes('shopping')) budgeted = inputs.shopping || 0;
      
      if (budgeted > 0 && actual > budgeted) {
        const excess = actual - budgeted;
        const excessPercent = (excess / budgeted) * 100;
        alerts.push({
          category,
          budgeted,
          actual,
          excess,
          severity: excessPercent > 50 ? 'critical' : 'warning',
        });
      }
    });

    setOverspendingAlerts(alerts);
    setShowResults(true);
  };

  const applySmartAllocations = () => {
    const allocations = smartAllocations.reduce((acc, alloc) => {
      const category = alloc.category.toLowerCase();
      if (category.includes('food')) acc.food = alloc.recommended;
      if (category.includes('transport')) acc.travel = alloc.recommended;
      if (category.includes('housing')) acc.rentOrEmi = alloc.recommended;
      if (category.includes('savings')) acc.investments = alloc.recommended;
      return acc;
    }, {} as Partial<BudgetInputs>);

    setInputs(prev => ({ ...prev, ...allocations }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-xl">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
            Advanced AI Budget Planner
          </h1>
          <p className="text-muted-foreground">Smart budgeting with AI-powered insights and predictions</p>
        </div>
      </div>

      {/* Overspending Alerts */}
      {overspendingAlerts.length > 0 && (
        <Alert variant={overspendingAlerts.some(a => a.severity === 'critical') ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Overspending Detected in {overspendingAlerts.length} Categories</p>
              {overspendingAlerts.map(alert => (
                <div key={alert.category} className="text-sm">
                  <span className="font-medium">{alert.category}:</span> Budgeted ${alert.budgeted.toFixed(2)}, Spent ${alert.actual.toFixed(2)} 
                  <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'} className="ml-2">
                    +${alert.excess.toFixed(2)} over
                  </Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Setup Progress</CardTitle>
          <CardDescription>Complete all mandatory fields to generate your AI budget plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {mandatoryFilled}/{mandatoryFields.length} mandatory fields • {optionalFilled}/{optionalFields.length} optional fields
            </p>
          </div>
        </CardContent>
      </Card>

      {/* User Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Profile</CardTitle>
          <CardDescription>Choose your financial profile for personalized recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={inputs.userMode === 'student' ? 'default' : 'outline'}
              className="h-20"
              onClick={() => handleInputChange('userMode', 'student')}
            >
              <div className="text-center">
                <div className="font-semibold">Student</div>
                <div className="text-xs opacity-70">Part-time income, education focus</div>
              </div>
            </Button>
            <Button
              variant={inputs.userMode === 'professional' ? 'default' : 'outline'}
              className="h-20"
              onClick={() => handleInputChange('userMode', 'professional')}
            >
              <div className="text-center">
                <div className="font-semibold">Professional</div>
                <div className="text-xs opacity-70">Full-time career, retirement planning</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mandatory Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Mandatory Inputs
          </CardTitle>
          <CardDescription>Required fields to calculate your budget</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income *</Label>
              <Input
                id="monthlyIncome"
                type="number"
                placeholder="0.00"
                value={inputs.monthlyIncome || ''}
                onChange={(e) => handleInputChange('monthlyIncome', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rentOrEmi">Rent/EMI *</Label>
              <Input
                id="rentOrEmi"
                type="number"
                placeholder="0.00"
                value={inputs.rentOrEmi || ''}
                onChange={(e) => handleInputChange('rentOrEmi', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="food">Food *</Label>
              <Input
                id="food"
                type="number"
                placeholder="0.00"
                value={inputs.food || ''}
                onChange={(e) => handleInputChange('food', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travel">Travel *</Label>
              <Input
                id="travel"
                type="number"
                placeholder="0.00"
                value={inputs.travel || ''}
                onChange={(e) => handleInputChange('travel', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utilities">Utilities *</Label>
              <Input
                id="utilities"
                type="number"
                placeholder="0.00"
                value={inputs.utilities || ''}
                onChange={(e) => handleInputChange('utilities', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="existingLoans">Existing Loans *</Label>
              <Input
                id="existingLoans"
                type="number"
                placeholder="0.00"
                value={inputs.existingLoans || ''}
                onChange={(e) => handleInputChange('existingLoans', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Optional Inputs
          </CardTitle>
          <CardDescription>Add these for more accurate budget planning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entertainment">Entertainment (Optional)</Label>
              <Input
                id="entertainment"
                type="number"
                placeholder="0.00"
                value={inputs.entertainment || ''}
                onChange={(e) => handleInputChange('entertainment', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscriptions">Subscriptions (Optional)</Label>
              <Input
                id="subscriptions"
                type="number"
                placeholder="0.00"
                value={inputs.subscriptions || ''}
                onChange={(e) => handleInputChange('subscriptions', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopping">Shopping (Optional)</Label>
              <Input
                id="shopping"
                type="number"
                placeholder="0.00"
                value={inputs.shopping || ''}
                onChange={(e) => handleInputChange('shopping', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance (Optional)</Label>
              <Input
                id="insurance"
                type="number"
                placeholder="0.00"
                value={inputs.insurance || ''}
                onChange={(e) => handleInputChange('insurance', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investments">Investments (Optional)</Label>
              <Input
                id="investments"
                type="number"
                placeholder="0.00"
                value={inputs.investments || ''}
                onChange={(e) => handleInputChange('investments', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyFund">Current Emergency Fund</Label>
              <Input
                id="emergencyFund"
                type="number"
                placeholder="0.00"
                value={inputs.emergencyFund || ''}
                onChange={(e) => handleInputChange('emergencyFund', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <Button
        onClick={calculateBudget}
        disabled={mandatoryFilled < mandatoryFields.length}
        size="lg"
        className="w-full"
      >
        <Brain className="mr-2 h-5 w-5" />
        Generate AI Budget Plan
      </Button>

      {/* Results */}
      {showResults && (
        <>
          {/* Smart Allocations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Smart Category Allocations
              </CardTitle>
              <CardDescription>AI-recommended spending limits based on your income</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {smartAllocations.map((alloc, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{alloc.category}</span>
                    <Badge variant="secondary">${alloc.recommended.toFixed(2)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alloc.explanation}</p>
                  {idx < smartAllocations.length - 1 && <Separator />}
                </div>
              ))}
              <Button onClick={applySmartAllocations} variant="outline" className="w-full mt-4">
                Apply Suggestions
              </Button>
            </CardContent>
          </Card>

          {/* Savings & Emergency Fund */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Auto Savings Percentage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">{savingsPercentage.toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground">
                    {savingsPercentage >= 20 ? 'Excellent savings rate!' : savingsPercentage >= 10 ? 'Good savings rate' : 'Consider increasing savings'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Emergency Fund Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">${emergencyFundTarget.toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground">
                    {inputs.userMode === 'student' ? '3 months' : '6 months'} of expenses
                  </p>
                  {inputs.emergencyFund > 0 && (
                    <div className="space-y-2">
                      <Progress value={(inputs.emergencyFund / emergencyFundTarget) * 100} />
                      <p className="text-xs text-muted-foreground">
                        ${inputs.emergencyFund.toFixed(2)} of ${emergencyFundTarget.toFixed(2)} saved
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* End of Month Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                End-of-Month Balance Prediction
              </CardTitle>
              <CardDescription>Based on your current spending trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className={`text-4xl font-bold ${endOfMonthBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${endOfMonthBalance.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {endOfMonthBalance >= 0 
                    ? 'You\'re on track to have a positive balance!' 
                    : 'Warning: You may overspend this month. Consider reducing expenses.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
