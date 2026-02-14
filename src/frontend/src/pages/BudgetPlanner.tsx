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
  PieChart as PieChartIcon, 
  Target,
  Download,
  AlertCircle,
  CheckCircle2,
  Info,
  LineChart as LineChartIcon,
  Lightbulb,
  TrendingDown
} from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';
import { 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { calculateProgress } from '../lib/budget-planner/progress';
import { generateBudgetPlan, type BudgetInputs } from '../lib/budget-planner/budgetLogic';
import { calculateHealthScore } from '../lib/budget-planner/healthScore';
import { generateRecommendations, generateActionPlan } from '../lib/budget-planner/recommendations';
import { generateICSFile } from '../lib/budget-planner/reminderIcs';
import { generateProjection } from '../lib/budget-planner/projections';

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
    const projection = generateProjection(inputs, plan);
    
    setBudgetPlan({
      ...plan,
      healthScore,
      recommendations,
      actionPlan,
      projection,
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
          Advanced Budget Planner
        </h1>
        <p className="text-muted-foreground text-lg">
          Create a personalized budget plan with insights on saving, investing, and improving your finances
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
                    <SelectItem value="short-term">Short-term (1-3 years)</SelectItem>
                    <SelectItem value="long-term">Long-term (3+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Optional Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-muted-foreground" />
                Optional Details (Recommended)
              </CardTitle>
              <CardDescription>
                Add more details for a more accurate and personalized budget plan
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        {showAdvanced && (
          <CardContent className="space-y-6">
            {/* Additional Income */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Additional Income Sources</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="secondaryIncome">Secondary Income</Label>
                  <Input
                    id="secondaryIncome"
                    type="number"
                    placeholder="Freelance, part-time, etc."
                    value={secondaryIncome}
                    onChange={(e) => setSecondaryIncome(e.target.value)}
                    min="0"
                    step="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passiveIncome">Passive Income</Label>
                  <Input
                    id="passiveIncome"
                    type="number"
                    placeholder="Rental, dividends, etc."
                    value={passiveIncome}
                    onChange={(e) => setPassiveIncome(e.target.value)}
                    min="0"
                    step="100"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Additional Expenses */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Additional Expenses</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="utilities">Utilities (Electricity, Water, Gas)</Label>
                  <Input
                    id="utilities"
                    type="number"
                    placeholder="Monthly utilities"
                    value={utilities}
                    onChange={(e) => setUtilities(e.target.value)}
                    min="0"
                    step="50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="internetMobile">Internet & Mobile</Label>
                  <Input
                    id="internetMobile"
                    type="number"
                    placeholder="Monthly bills"
                    value={internetMobile}
                    onChange={(e) => setInternetMobile(e.target.value)}
                    min="0"
                    step="50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Premiums</Label>
                  <Input
                    id="insurance"
                    type="number"
                    placeholder="Health, life, etc."
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    min="0"
                    step="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="educationFees">Education / Tuition Fees</Label>
                  <Input
                    id="educationFees"
                    type="number"
                    placeholder="Monthly education costs"
                    value={educationFees}
                    onChange={(e) => setEducationFees(e.target.value)}
                    min="0"
                    step="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loanEMIs">Loan EMIs</Label>
                  <Input
                    id="loanEMIs"
                    type="number"
                    placeholder="Total monthly EMIs"
                    value={loanEMIs}
                    onChange={(e) => setLoanEMIs(e.target.value)}
                    min="0"
                    step="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shopping">Shopping & Personal Care</Label>
                  <Input
                    id="shopping"
                    type="number"
                    placeholder="Clothing, grooming, etc."
                    value={shopping}
                    onChange={(e) => setShopping(e.target.value)}
                    min="0"
                    step="50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entertainment">Entertainment</Label>
                  <Input
                    id="entertainment"
                    type="number"
                    placeholder="Movies, dining, hobbies"
                    value={entertainment}
                    onChange={(e) => setEntertainment(e.target.value)}
                    min="0"
                    step="50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="travel">Travel & Vacation</Label>
                  <Input
                    id="travel"
                    type="number"
                    placeholder="Monthly travel budget"
                    value={travel}
                    onChange={(e) => setTravel(e.target.value)}
                    min="0"
                    step="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medical">Medical & Healthcare</Label>
                  <Input
                    id="medical"
                    type="number"
                    placeholder="Monthly medical costs"
                    value={medical}
                    onChange={(e) => setMedical(e.target.value)}
                    min="0"
                    step="50"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Financial Goals */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Financial Goals & Planning</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyFund">Emergency Fund (Current)</Label>
                  <Input
                    id="emergencyFund"
                    type="number"
                    placeholder="Current emergency savings"
                    value={emergencyFund}
                    onChange={(e) => setEmergencyFund(e.target.value)}
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="retirementPlanning">Retirement Savings (Current)</Label>
                  <Input
                    id="retirementPlanning"
                    type="number"
                    placeholder="Current retirement fund"
                    value={retirementPlanning}
                    onChange={(e) => setRetirementPlanning(e.target.value)}
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Savings Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="Your financial goal"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline (Months)</Label>
                  <Input
                    id="timeline"
                    type="number"
                    placeholder="Months to reach goal"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    min="1"
                    step="1"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Behavioral Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Behavioral Preferences</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select value={riskTolerance} onValueChange={(v: any) => setRiskTolerance(v)}>
                    <SelectTrigger id="riskTolerance">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Conservative)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (Aggressive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="spendingBehavior">Spending Behavior</Label>
                  <Select value={spendingBehavior} onValueChange={(v: any) => setSpendingBehavior(v)}>
                    <SelectTrigger id="spendingBehavior">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saver">Saver (Cautious)</SelectItem>
                      <SelectItem value="spender">Spender (Flexible)</SelectItem>
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
                      <SelectItem value="auto">Automatic (Set & Forget)</SelectItem>
                      <SelectItem value="manual">Manual (Active Control)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="financialKnowledge">Financial Knowledge</Label>
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
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleSkipAdvanced}>
                Skip Optional Fields
              </Button>
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
          className="min-w-[200px]"
        >
          <Target className="w-5 h-5 mr-2" />
          Generate Budget Plan
        </Button>
      </div>
      
      {/* Results Section */}
      {budgetPlan && (
        <div id="budget-results" className="space-y-6 pt-8">
          <Separator className="my-8" />
          
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
              Your Personalized Budget Plan
            </h2>
            <p className="text-muted-foreground">
              Based on your inputs, here's a comprehensive financial plan with actionable insights
            </p>
          </div>
          
          {/* Health Score */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Financial Health Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-primary">{budgetPlan.healthScore.score}/100</p>
                  <p className="text-sm text-muted-foreground">Overall Financial Health</p>
                </div>
                <Badge 
                  variant={budgetPlan.healthScore.score >= 70 ? 'default' : budgetPlan.healthScore.score >= 40 ? 'secondary' : 'destructive'}
                  className="text-lg px-4 py-2"
                >
                  {budgetPlan.healthScore.score >= 70 ? 'Excellent' : budgetPlan.healthScore.score >= 40 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
              <Progress value={budgetPlan.healthScore.score} className="h-3" />
              <p className="text-sm text-muted-foreground">{budgetPlan.healthScore.explanation}</p>
            </CardContent>
          </Card>
          
          {/* Budget Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-chart-1" />
                Budget Allocation Summary
              </CardTitle>
              <CardDescription>
                Recommended distribution based on {budgetPlan.rule} rule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground">Needs (Essential)</p>
                  <p className="text-2xl font-bold text-green-600">{format(budgetPlan.allocations.needs)}</p>
                  <p className="text-xs text-muted-foreground">
                    {((budgetPlan.allocations.needs / budgetPlan.allocations.totalIncome) * 100).toFixed(0)}% of income
                  </p>
                </div>
                
                <div className="space-y-2 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-muted-foreground">Wants (Lifestyle)</p>
                  <p className="text-2xl font-bold text-blue-600">{format(budgetPlan.allocations.wants)}</p>
                  <p className="text-xs text-muted-foreground">
                    {((budgetPlan.allocations.wants / budgetPlan.allocations.totalIncome) * 100).toFixed(0)}% of income
                  </p>
                </div>
                
                <div className="space-y-2 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-sm text-muted-foreground">Savings & Investments</p>
                  <p className="text-2xl font-bold text-purple-600">{format(budgetPlan.allocations.savings)}</p>
                  <p className="text-xs text-muted-foreground">
                    {((budgetPlan.allocations.savings / budgetPlan.allocations.totalIncome) * 100).toFixed(0)}% of income
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Total Monthly Income</p>
                  <p className="text-xl font-bold">{format(budgetPlan.allocations.totalIncome)}</p>
                </div>
                
                <div className="space-y-2 p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Total Monthly Expenses</p>
                  <p className="text-xl font-bold">{format(budgetPlan.allocations.totalExpenses)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Expense Breakdown Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-chart-2" />
                Expense Category Breakdown
              </CardTitle>
              <CardDescription>
                Visual breakdown of your monthly expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={budgetPlan.expenseBreakdown.map((item: any, index: number) => ({
                        name: item.category,
                        value: item.amount,
                        percentage: item.percentage,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }: any) => `${name}: ${percentage.toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {budgetPlan.expenseBreakdown.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => format(value)}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              
              {/* Category Details */}
              <div className="mt-6 space-y-3">
                {budgetPlan.expenseBreakdown.map((item: any, index: number) => (
                  <div key={item.category} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: EXPENSE_COLORS[index % EXPENSE_COLORS.length] }}
                      />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{format(item.amount)}</p>
                      <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* 12-Month Projection Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-chart-3" />
                12-Month Savings Projection
              </CardTitle>
              <CardDescription>
                Realistic projection of your savings growth over the next year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={budgetPlan.projection}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => format(value)}
                    />
                    <Tooltip 
                      formatter={(value: any) => format(value)}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="monthlySavings" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Monthly Savings"
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cumulativeSavings" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Cumulative Savings"
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Projection Summary */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Monthly Savings</p>
                  <p className="text-xl font-bold text-green-600">
                    {format(budgetPlan.projection[0]?.monthlySavings || 0)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Year-End Total</p>
                  <p className="text-xl font-bold text-blue-600">
                    {format(budgetPlan.projection[11]?.cumulativeSavings || 0)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Savings Rate</p>
                  <p className="text-xl font-bold text-purple-600">
                    {((budgetPlan.allocations.savings / budgetPlan.allocations.totalIncome) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Financial Improvement Recommendations */}
          <Card className="border-2 border-chart-1/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Personalized Financial Recommendations
              </CardTitle>
              <CardDescription>
                Expert guidance on saving, investing, and improving your finances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Saving Strategy */}
              {budgetPlan.recommendations.savingStrategy && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Saving Strategy</h3>
                  </div>
                  <div className="pl-10 space-y-2">
                    <p className="text-muted-foreground">{budgetPlan.recommendations.savingStrategy.overview}</p>
                    <ul className="space-y-2 mt-3">
                      {budgetPlan.recommendations.savingStrategy.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <Separator />
              
              {/* Investing Guidance */}
              {budgetPlan.recommendations.investingGuidance && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Beginner-Friendly Investing Guidance</h3>
                  </div>
                  <div className="pl-10 space-y-2">
                    <p className="text-muted-foreground">{budgetPlan.recommendations.investingGuidance.overview}</p>
                    <ul className="space-y-2 mt-3">
                      {budgetPlan.recommendations.investingGuidance.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-xs text-muted-foreground flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Educational Disclaimer:</strong> This is general educational guidance only, not personalized investment advice. 
                          All investments carry risk. Consult a qualified financial advisor before making investment decisions.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Separator />
              
              {/* Financial Improvement Steps */}
              {budgetPlan.recommendations.financialImprovement && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Overall Financial Improvement</h3>
                  </div>
                  <div className="pl-10 space-y-2">
                    <p className="text-muted-foreground">{budgetPlan.recommendations.financialImprovement.overview}</p>
                    <ul className="space-y-2 mt-3">
                      {budgetPlan.recommendations.financialImprovement.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* 3-Step Action Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Your 3-Step Action Plan
              </CardTitle>
              <CardDescription>
                Practical steps to implement your budget plan immediately
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetPlan.actionPlan.map((step: string, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm">{step}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadReminder(step, index)}
                      className="mt-2"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Assumptions */}
          {budgetPlan.assumptions && budgetPlan.assumptions.length > 0 && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <Info className="w-5 h-5" />
                  Assumptions Made
                </CardTitle>
                <CardDescription>
                  These estimates were used where specific data wasn't provided
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {budgetPlan.assumptions.map((assumption: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>{assumption}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {/* Educational Disclaimer */}
          <Card className="border-muted">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">Educational Purpose Only</p>
                  <p className="text-xs text-muted-foreground">
                    This budget plan is for educational purposes and general guidance only. It is not personalized financial advice. 
                    Your actual financial situation may require professional consultation. Always consider your unique circumstances 
                    and consult qualified financial advisors before making significant financial decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
