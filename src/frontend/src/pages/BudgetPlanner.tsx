import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  TrendingUp, 
  PieChart, 
  Target,
  Download,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculateProgress } from '../lib/budget-planner/progress';
import { generateBudgetPlan, type BudgetInputs } from '../lib/budget-planner/budgetLogic';
import { calculateHealthScore } from '../lib/budget-planner/healthScore';
import { generateRecommendations, generateActionPlan } from '../lib/budget-planner/recommendations';
import { generateICSFile } from '../lib/budget-planner/reminderIcs';

const EXPENSE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function BudgetPlanner() {
  const { format, currency } = useCurrency();
  
  // Required inputs
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [rent, setRent] = useState('');
  const [rentNotApplicable, setRentNotApplicable] = useState(false);
  const [foodGroceries, setFoodGroceries] = useState('');
  const [transport, setTransport] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  const [savingsType, setSavingsType] = useState<'amount' | 'percentage'>('amount');
  const [goalType, setGoalType] = useState<'short-term' | 'long-term'>('short-term');
  
  // Optional inputs
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [secondaryIncome, setSecondaryIncome] = useState('');
  const [passiveIncome, setPassiveIncome] = useState('');
  const [incomeFrequency, setIncomeFrequency] = useState('monthly');
  const [utilities, setUtilities] = useState('');
  const [internetMobile, setInternetMobile] = useState('');
  const [insurance, setInsurance] = useState('');
  const [educationFees, setEducationFees] = useState('');
  const [loanEMIs, setLoanEMIs] = useState('');
  const [shopping, setShopping] = useState('');
  const [entertainment, setEntertainment] = useState('');
  const [travel, setTravel] = useState('');
  const [medical, setMedical] = useState('');
  const [emergencyFund, setEmergencyFund] = useState('');
  const [retirementPlanning, setRetirementPlanning] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [spendingBehavior, setSpendingBehavior] = useState<'saver' | 'spender'>('saver');
  const [savingStyle, setSavingStyle] = useState<'auto' | 'manual'>('auto');
  const [financialKnowledge, setFinancialKnowledge] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  
  // Results state
  const [budgetPlan, setBudgetPlan] = useState<any>(null);
  
  // Calculate progress
  const progress = useMemo(() => {
    const requiredFields = {
      monthlyIncome: !!monthlyIncome,
      foodGroceries: !!foodGroceries,
      transport: !!transport,
      savingsAmount: !!savingsAmount,
      goalType: !!goalType,
      rent: rentNotApplicable || !!rent,
    };
    
    const optionalFields = {
      secondaryIncome: !!secondaryIncome,
      passiveIncome: !!passiveIncome,
      utilities: !!utilities,
      internetMobile: !!internetMobile,
      insurance: !!insurance,
      educationFees: !!educationFees,
      loanEMIs: !!loanEMIs,
      shopping: !!shopping,
      entertainment: !!entertainment,
      travel: !!travel,
      medical: !!medical,
      emergencyFund: !!emergencyFund,
      retirementPlanning: !!retirementPlanning,
      targetAmount: !!targetAmount,
      timeline: !!timeline,
    };
    
    return calculateProgress(requiredFields, optionalFields);
  }, [
    monthlyIncome, rent, rentNotApplicable, foodGroceries, transport, savingsAmount, goalType,
    secondaryIncome, passiveIncome, utilities, internetMobile, insurance, educationFees,
    loanEMIs, shopping, entertainment, travel, medical, emergencyFund, retirementPlanning,
    targetAmount, timeline
  ]);
  
  const handleSkipAdvanced = () => {
    setShowAdvanced(false);
    // Clear all optional fields
    setSecondaryIncome('');
    setPassiveIncome('');
    setIncomeFrequency('monthly');
    setUtilities('');
    setInternetMobile('');
    setInsurance('');
    setEducationFees('');
    setLoanEMIs('');
    setShopping('');
    setEntertainment('');
    setTravel('');
    setMedical('');
    setEmergencyFund('');
    setRetirementPlanning('');
    setTargetAmount('');
    setTimeline('');
    setRiskTolerance('medium');
    setSpendingBehavior('saver');
    setSavingStyle('auto');
    setFinancialKnowledge('beginner');
  };
  
  const handleGeneratePlan = () => {
    const inputs: BudgetInputs = {
      monthlyIncome: parseFloat(monthlyIncome) || 0,
      rent: rentNotApplicable ? 0 : (parseFloat(rent) || 0),
      foodGroceries: parseFloat(foodGroceries) || 0,
      transport: parseFloat(transport) || 0,
      savingsAmount: parseFloat(savingsAmount) || 0,
      savingsType,
      goalType,
      secondaryIncome: parseFloat(secondaryIncome) || 0,
      passiveIncome: parseFloat(passiveIncome) || 0,
      utilities: parseFloat(utilities) || 0,
      internetMobile: parseFloat(internetMobile) || 0,
      insurance: parseFloat(insurance) || 0,
      educationFees: parseFloat(educationFees) || 0,
      loanEMIs: parseFloat(loanEMIs) || 0,
      shopping: parseFloat(shopping) || 0,
      entertainment: parseFloat(entertainment) || 0,
      travel: parseFloat(travel) || 0,
      medical: parseFloat(medical) || 0,
      emergencyFund: parseFloat(emergencyFund) || 0,
      retirementPlanning: parseFloat(retirementPlanning) || 0,
      targetAmount: parseFloat(targetAmount) || 0,
      timeline: parseFloat(timeline) || 0,
      riskTolerance,
      spendingBehavior,
      savingStyle,
      financialKnowledge,
    };
    
    const plan = generateBudgetPlan(inputs);
    const healthScore = calculateHealthScore(inputs, plan);
    const recommendations = generateRecommendations(inputs, plan);
    const actionPlan = generateActionPlan(inputs, plan);
    
    setBudgetPlan({
      ...plan,
      healthScore,
      recommendations,
      actionPlan,
    });
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('budget-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const canGenerate = monthlyIncome && foodGroceries && transport && savingsAmount && (rentNotApplicable || rent);
  
  const downloadReminder = (step: string, index: number) => {
    const icsContent = generateICSFile(step, index);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-action-step-${index + 1}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
          Budget Planner
        </h1>
        <p className="text-muted-foreground text-lg">
          Create a personalized budget plan based on your financial situation
        </p>
      </div>
      
      {/* Privacy Notice */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Privacy-First & Minimal Data</p>
              <p className="text-sm text-muted-foreground">
                Your financial data stays private. We only need basic information to create your budget plan. 
                All calculations happen locally in your browser.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Completion Progress</p>
              <p className="text-sm text-muted-foreground">You're {progress}% done</p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      {/* Required Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Required Information
          </CardTitle>
          <CardDescription>
            These fields are essential to generate your budget plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Income */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Income</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (Primary) *</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="Enter your monthly income"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  min="0"
                  step="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                  <span className="font-medium">{currency.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Core Expenses */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Core Expenses</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rent">Rent / Home EMI</Label>
                <Input
                  id="rent"
                  type="number"
                  placeholder="Enter rent or EMI"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  disabled={rentNotApplicable}
                  min="0"
                  step="100"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rentNA"
                    checked={rentNotApplicable}
                    onChange={(e) => {
                      setRentNotApplicable(e.target.checked);
                      if (e.target.checked) setRent('');
                    }}
                    className="rounded"
                  />
                  <Label htmlFor="rentNA" className="text-sm font-normal cursor-pointer">
                    Not applicable
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="foodGroceries">Food & Groceries *</Label>
                <Input
                  id="foodGroceries"
                  type="number"
                  placeholder="Monthly food expenses"
                  value={foodGroceries}
                  onChange={(e) => setFoodGroceries(e.target.value)}
                  min="0"
                  step="100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transport">Transport *</Label>
                <Input
                  id="transport"
                  type="number"
                  placeholder="Monthly transport costs"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Savings Preference */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Savings Preference</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="savingsAmount">Desired Monthly Savings *</Label>
                <div className="flex gap-2">
                  <Input
                    id="savingsAmount"
                    type="number"
                    placeholder={savingsType === 'amount' ? 'Amount' : 'Percentage'}
                    value={savingsAmount}
                    onChange={(e) => setSavingsAmount(e.target.value)}
                    min="0"
                    step={savingsType === 'amount' ? '100' : '1'}
                  />
                  <Select value={savingsType} onValueChange={(v: any) => setSavingsType(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="percentage">%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goalType">Financial Goal Type *</Label>
                <Select value={goalType} onValueChange={(v: any) => setGoalType(v)}>
                  <SelectTrigger id="goalType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short-term">Short-term (0-2 years)</SelectItem>
                    <SelectItem value="long-term">Long-term (2+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Advanced Section */}
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-muted-foreground" />
                Advanced Details (Optional)
              </CardTitle>
              <CardDescription>
                Provide more details for a more accurate budget plan
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {showAdvanced && (
                <Button variant="outline" size="sm" onClick={handleSkipAdvanced}>
                  Skip
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showAdvanced && (
          <CardContent className="space-y-6">
            {/* Income Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Income Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="secondaryIncome">Secondary Income</Label>
                  <Input
                    id="secondaryIncome"
                    type="number"
                    placeholder="Optional"
                    value={secondaryIncome}
                    onChange={(e) => setSecondaryIncome(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passiveIncome">Passive Income</Label>
                  <Input
                    id="passiveIncome"
                    type="number"
                    placeholder="Optional"
                    value={passiveIncome}
                    onChange={(e) => setPassiveIncome(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Fixed Expenses */}
            <div className="space-y-4">
              <h3 className="font-semibold">Fixed Expenses</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="utilities">Utilities (Electricity, Water)</Label>
                  <Input
                    id="utilities"
                    type="number"
                    placeholder="Optional"
                    value={utilities}
                    onChange={(e) => setUtilities(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internetMobile">Internet & Mobile</Label>
                  <Input
                    id="internetMobile"
                    type="number"
                    placeholder="Optional"
                    value={internetMobile}
                    onChange={(e) => setInternetMobile(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance</Label>
                  <Input
                    id="insurance"
                    type="number"
                    placeholder="Optional"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="educationFees">Education Fees</Label>
                  <Input
                    id="educationFees"
                    type="number"
                    placeholder="Optional"
                    value={educationFees}
                    onChange={(e) => setEducationFees(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanEMIs">Loan EMIs</Label>
                  <Input
                    id="loanEMIs"
                    type="number"
                    placeholder="Optional"
                    value={loanEMIs}
                    onChange={(e) => setLoanEMIs(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Variable Expenses */}
            <div className="space-y-4">
              <h3 className="font-semibold">Variable Expenses</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shopping">Shopping</Label>
                  <Input
                    id="shopping"
                    type="number"
                    placeholder="Optional"
                    value={shopping}
                    onChange={(e) => setShopping(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entertainment">Entertainment & Subscriptions</Label>
                  <Input
                    id="entertainment"
                    type="number"
                    placeholder="Optional"
                    value={entertainment}
                    onChange={(e) => setEntertainment(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travel">Travel</Label>
                  <Input
                    id="travel"
                    type="number"
                    placeholder="Optional"
                    value={travel}
                    onChange={(e) => setTravel(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medical">Medical Expenses</Label>
                  <Input
                    id="medical"
                    type="number"
                    placeholder="Optional"
                    value={medical}
                    onChange={(e) => setMedical(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Goals & Savings */}
            <div className="space-y-4">
              <h3 className="font-semibold">Goals & Savings</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyFund">Emergency Fund Status</Label>
                  <Input
                    id="emergencyFund"
                    type="number"
                    placeholder="Current amount"
                    value={emergencyFund}
                    onChange={(e) => setEmergencyFund(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retirementPlanning">Retirement Planning</Label>
                  <Input
                    id="retirementPlanning"
                    type="number"
                    placeholder="Monthly contribution"
                    value={retirementPlanning}
                    onChange={(e) => setRetirementPlanning(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="Goal amount"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline (months)</Label>
                  <Input
                    id="timeline"
                    type="number"
                    placeholder="Months to achieve goal"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select value={riskTolerance} onValueChange={(v: any) => setRiskTolerance(v)}>
                    <SelectTrigger id="riskTolerance">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Lifestyle & Habits */}
            <div className="space-y-4">
              <h3 className="font-semibold">Lifestyle & Habits</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="spendingBehavior">Spending Behavior</Label>
                  <Select value={spendingBehavior} onValueChange={(v: any) => setSpendingBehavior(v)}>
                    <SelectTrigger id="spendingBehavior">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saver">Saver</SelectItem>
                      <SelectItem value="spender">Spender</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="savingStyle">Saving Style</Label>
                  <Select value={savingStyle} onValueChange={(v: any) => setSavingStyle(v)}>
                    <SelectTrigger id="savingStyle">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financialKnowledge">Financial Knowledge Level</Label>
                  <Select value={financialKnowledge} onValueChange={(v: any) => setFinancialKnowledge(v)}>
                    <SelectTrigger id="financialKnowledge">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleGeneratePlan}
          disabled={!canGenerate}
          className="w-full md:w-auto min-w-64 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Generate Budget Plan
        </Button>
      </div>
      
      {/* Results Section */}
      {budgetPlan && (
        <div id="budget-results" className="space-y-6 pt-8">
          <Separator className="my-8" />
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Your Personalized Budget Plan
            </h2>
            <p className="text-muted-foreground">
              Based on your inputs, here's your customized financial roadmap
            </p>
          </div>
          
          {/* Finance Health Score */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Finance Health Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                  {budgetPlan.healthScore.score}
                </div>
                <div className="text-2xl text-muted-foreground">/ 100</div>
              </div>
              <Progress value={budgetPlan.healthScore.score} className="h-3" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {budgetPlan.healthScore.explanation}
              </p>
            </CardContent>
          </Card>
          
          {/* Budget Summary */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {format(budgetPlan.summary.totalIncome)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-destructive">
                  {format(budgetPlan.summary.totalExpenses)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-chart-1">
                  {format(budgetPlan.summary.suggestedSavings)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation</CardTitle>
              <CardDescription>
                {budgetPlan.allocation.rule} rule applied
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Needs ({budgetPlan.allocation.needs.percentage}%)</span>
                    <span className="text-sm font-semibold">{format(budgetPlan.allocation.needs.amount)}</span>
                  </div>
                  <Progress value={budgetPlan.allocation.needs.percentage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Wants ({budgetPlan.allocation.wants.percentage}%)</span>
                    <span className="text-sm font-semibold">{format(budgetPlan.allocation.wants.amount)}</span>
                  </div>
                  <Progress value={budgetPlan.allocation.wants.percentage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Savings ({budgetPlan.allocation.savings.percentage}%)</span>
                    <span className="text-sm font-semibold">{format(budgetPlan.allocation.savings.amount)}</span>
                  </div>
                  <Progress value={budgetPlan.allocation.savings.percentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Visual Insights */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Expense Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Expense Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={budgetPlan.expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {budgetPlan.expenseBreakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => format(value)} />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Savings Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Savings Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Savings</span>
                    <span className="text-sm font-semibold">{format(budgetPlan.savingsProgress.current)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Target Savings</span>
                    <span className="text-sm font-semibold">{format(budgetPlan.savingsProgress.target)}</span>
                  </div>
                  <Progress value={budgetPlan.savingsProgress.percentage} className="h-3" />
                  <p className="text-xs text-muted-foreground text-center">
                    {budgetPlan.savingsProgress.percentage.toFixed(1)}% of target achieved
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Cash Flow Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Surplus:</span>
                      <span className={budgetPlan.cashFlow.surplus >= 0 ? 'text-chart-1 font-semibold' : 'text-destructive font-semibold'}>
                        {format(budgetPlan.cashFlow.surplus)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Savings Rate:</span>
                      <span className="font-semibold">{budgetPlan.cashFlow.savingsRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Assumptions */}
          {budgetPlan.assumptions.length > 0 && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                  Assumptions Used
                </CardTitle>
                <CardDescription>
                  These defaults were applied where data was not provided
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {budgetPlan.assumptions.map((assumption: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                      <span>{assumption}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-chart-1" />
                Smart Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {budgetPlan.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Action Plan */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Your 3-Step Action Plan
              </CardTitle>
              <CardDescription>
                Clear steps to implement this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetPlan.actionPlan.map((step: string, index: number) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-chart-1/5 border border-primary/10">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm leading-relaxed">{step}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReminder(step, index)}
                        className="mt-2"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Reminder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
