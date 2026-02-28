import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, DollarSign, Flame, Receipt } from 'lucide-react';
import { useState } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import AccessDenied from '../components/AccessDenied';

export default function Calculators() {
  const { identity } = useInternetIdentity();
  const { format, symbol } = useCurrency();

  // SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState('5000');
  const [sipRate, setSipRate] = useState('12');
  const [sipYears, setSipYears] = useState('10');
  const [sipResult, setSipResult] = useState<{ invested: number; returns: number; total: number } | null>(null);

  // Lumpsum Calculator State
  const [lumpsumAmount, setLumpsumAmount] = useState('100000');
  const [lumpsumRate, setLumpsumRate] = useState('12');
  const [lumpsumYears, setLumpsumYears] = useState('10');
  const [lumpsumResult, setLumpsumResult] = useState<{ invested: number; returns: number; total: number } | null>(null);

  // FIRE Calculator State
  const [fireExpenses, setFireExpenses] = useState('50000');
  const [fireCurrentSavings, setFireCurrentSavings] = useState('500000');
  const [fireMonthlySavings, setFireMonthlySavings] = useState('20000');
  const [fireRate, setFireRate] = useState('12');
  const [fireResult, setFireResult] = useState<{ targetCorpus: number; yearsToFire: number; monthlyIncome: number } | null>(null);

  // Tax Calculator State
  const [taxIncome, setTaxIncome] = useState('1000000');
  const [taxDeductions, setTaxDeductions] = useState('150000');
  const [taxResult, setTaxResult] = useState<{ taxableIncome: number; tax: number; netIncome: number } | null>(null);

  if (!identity) {
    return <AccessDenied />;
  }

  const calculateSIP = () => {
    const monthly = parseFloat(sipMonthly);
    const rate = parseFloat(sipRate) / 100 / 12;
    const months = parseFloat(sipYears) * 12;

    const futureValue = monthly * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate));
    const invested = monthly * months;
    const returns = futureValue - invested;

    setSipResult({
      invested: Math.round(invested),
      returns: Math.round(returns),
      total: Math.round(futureValue),
    });
  };

  const calculateLumpsum = () => {
    const principal = parseFloat(lumpsumAmount);
    const rate = parseFloat(lumpsumRate) / 100;
    const years = parseFloat(lumpsumYears);

    const futureValue = principal * Math.pow(1 + rate, years);
    const returns = futureValue - principal;

    setLumpsumResult({
      invested: Math.round(principal),
      returns: Math.round(returns),
      total: Math.round(futureValue),
    });
  };

  const calculateFIRE = () => {
    const monthlyExpenses = parseFloat(fireExpenses);
    const currentSavings = parseFloat(fireCurrentSavings);
    const monthlySavings = parseFloat(fireMonthlySavings);
    const annualRate = parseFloat(fireRate) / 100;

    // 25x rule for FIRE
    const targetCorpus = monthlyExpenses * 12 * 25;
    const remainingCorpus = targetCorpus - currentSavings;

    // Calculate years to FIRE with compound interest
    const monthlyRate = annualRate / 12;
    const months = Math.log((remainingCorpus * monthlyRate) / monthlySavings + 1) / Math.log(1 + monthlyRate);
    const yearsToFire = months / 12;

    // 4% withdrawal rule
    const monthlyIncome = (targetCorpus * 0.04) / 12;

    setFireResult({
      targetCorpus: Math.round(targetCorpus),
      yearsToFire: Math.round(yearsToFire * 10) / 10,
      monthlyIncome: Math.round(monthlyIncome),
    });
  };

  const calculateTax = () => {
    const income = parseFloat(taxIncome);
    const deductions = parseFloat(taxDeductions);
    const taxableIncome = income - deductions;

    let tax = 0;
    // New tax regime (simplified)
    if (taxableIncome <= 300000) {
      tax = 0;
    } else if (taxableIncome <= 600000) {
      tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 900000) {
      tax = 15000 + (taxableIncome - 600000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      tax = 45000 + (taxableIncome - 900000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      tax = 90000 + (taxableIncome - 1200000) * 0.20;
    } else {
      tax = 150000 + (taxableIncome - 1500000) * 0.30;
    }

    setTaxResult({
      taxableIncome: Math.round(taxableIncome),
      tax: Math.round(tax),
      netIncome: Math.round(income - tax),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Calculators
          </h1>
          <p className="text-muted-foreground">Decision Helpers - Plan your financial future with real-time calculations in {symbol}</p>
        </div>

        {/* Calculators Tabs */}
        <Tabs defaultValue="sip" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2">
            <TabsTrigger value="sip" className="flex items-center gap-2 py-3">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">SIP Calculator</span>
              <span className="sm:hidden">SIP</span>
            </TabsTrigger>
            <TabsTrigger value="lumpsum" className="flex items-center gap-2 py-3">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Lumpsum</span>
              <span className="sm:hidden">Lumpsum</span>
            </TabsTrigger>
            <TabsTrigger value="fire" className="flex items-center gap-2 py-3">
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">FIRE Calculator</span>
              <span className="sm:hidden">FIRE</span>
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2 py-3">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Tax Calculator</span>
              <span className="sm:hidden">Tax</span>
            </TabsTrigger>
          </TabsList>

          {/* SIP Calculator */}
          <TabsContent value="sip" className="space-y-6">
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  SIP Calculator
                </CardTitle>
                <CardDescription>
                  Calculate returns on your Systematic Investment Plan in {symbol}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sip-monthly">Monthly Investment ({symbol})</Label>
                    <Input
                      id="sip-monthly"
                      type="number"
                      value={sipMonthly}
                      onChange={(e) => setSipMonthly(e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sip-rate">Expected Return Rate (%)</Label>
                    <Input
                      id="sip-rate"
                      type="number"
                      value={sipRate}
                      onChange={(e) => setSipRate(e.target.value)}
                      placeholder="12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sip-years">Time Period (Years)</Label>
                    <Input
                      id="sip-years"
                      type="number"
                      value={sipYears}
                      onChange={(e) => setSipYears(e.target.value)}
                      placeholder="10"
                    />
                  </div>
                </div>

                <Button onClick={calculateSIP} className="w-full" size="lg">
                  Calculate SIP Returns
                </Button>

                {sipResult && (
                  <div className="grid md:grid-cols-3 gap-4 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-chart-1/10 border-2 border-primary/20">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Total Invested</p>
                      <p className="text-2xl font-bold">{format(sipResult.invested)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Estimated Returns</p>
                      <p className="text-2xl font-bold text-green-500">{format(sipResult.returns)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Total Value</p>
                      <p className="text-2xl font-bold text-primary">{format(sipResult.total)}</p>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <p className="font-semibold mb-2">💡 Plain Language Explanation:</p>
                  <p>
                    If you invest {format(parseFloat(sipMonthly))} every month for {sipYears} years at {sipRate}% annual return,
                    you'll build a corpus of approximately {sipResult ? format(sipResult.total) : '...'}.
                    This includes your investment of {sipResult ? format(sipResult.invested) : '...'} and
                    returns of {sipResult ? format(sipResult.returns) : '...'}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lumpsum Calculator */}
          <TabsContent value="lumpsum" className="space-y-6">
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Lumpsum Calculator
                </CardTitle>
                <CardDescription>
                  Calculate returns on one-time investment in {symbol}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lumpsum-amount">Investment Amount ({symbol})</Label>
                    <Input
                      id="lumpsum-amount"
                      type="number"
                      value={lumpsumAmount}
                      onChange={(e) => setLumpsumAmount(e.target.value)}
                      placeholder="100000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lumpsum-rate">Expected Return Rate (%)</Label>
                    <Input
                      id="lumpsum-rate"
                      type="number"
                      value={lumpsumRate}
                      onChange={(e) => setLumpsumRate(e.target.value)}
                      placeholder="12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lumpsum-years">Time Period (Years)</Label>
                    <Input
                      id="lumpsum-years"
                      type="number"
                      value={lumpsumYears}
                      onChange={(e) => setLumpsumYears(e.target.value)}
                      placeholder="10"
                    />
                  </div>
                </div>

                <Button onClick={calculateLumpsum} className="w-full" size="lg">
                  Calculate Lumpsum Returns
                </Button>

                {lumpsumResult && (
                  <div className="grid md:grid-cols-3 gap-4 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-chart-1/10 border-2 border-primary/20">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Total Invested</p>
                      <p className="text-2xl font-bold">{format(lumpsumResult.invested)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Estimated Returns</p>
                      <p className="text-2xl font-bold text-green-500">{format(lumpsumResult.returns)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Total Value</p>
                      <p className="text-2xl font-bold text-primary">{format(lumpsumResult.total)}</p>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <p className="font-semibold mb-2">💡 Plain Language Explanation:</p>
                  <p>
                    A one-time investment of {format(parseFloat(lumpsumAmount))} at {lumpsumRate}% annual return for {lumpsumYears} years
                    will grow to approximately {lumpsumResult ? format(lumpsumResult.total) : '...'}.
                    Your returns will be {lumpsumResult ? format(lumpsumResult.returns) : '...'}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FIRE Calculator */}
          <TabsContent value="fire" className="space-y-6">
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-primary" />
                  FIRE Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your Financial Independence, Retire Early timeline in {symbol}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fire-expenses">Monthly Expenses ({symbol})</Label>
                    <Input
                      id="fire-expenses"
                      type="number"
                      value={fireExpenses}
                      onChange={(e) => setFireExpenses(e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fire-current">Current Savings ({symbol})</Label>
                    <Input
                      id="fire-current"
                      type="number"
                      value={fireCurrentSavings}
                      onChange={(e) => setFireCurrentSavings(e.target.value)}
                      placeholder="500000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fire-monthly">Monthly Savings ({symbol})</Label>
                    <Input
                      id="fire-monthly"
                      type="number"
                      value={fireMonthlySavings}
                      onChange={(e) => setFireMonthlySavings(e.target.value)}
                      placeholder="20000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fire-rate">Expected Return Rate (%)</Label>
                    <Input
                      id="fire-rate"
                      type="number"
                      value={fireRate}
                      onChange={(e) => setFireRate(e.target.value)}
                      placeholder="12"
                    />
                  </div>
                </div>

                <Button onClick={calculateFIRE} className="w-full" size="lg">
                  Calculate FIRE Timeline
                </Button>

                {fireResult && (
                  <div className="grid md:grid-cols-3 gap-4 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-chart-1/10 border-2 border-primary/20">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Target Corpus</p>
                      <p className="text-2xl font-bold">{format(fireResult.targetCorpus)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Years to FIRE</p>
                      <p className="text-2xl font-bold text-primary">{fireResult.yearsToFire} years</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Monthly Income</p>
                      <p className="text-2xl font-bold text-green-500">{format(fireResult.monthlyIncome)}</p>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <p className="font-semibold mb-2">💡 Plain Language Explanation:</p>
                  <p>
                    Based on the 25x rule, you need {fireResult ? format(fireResult.targetCorpus) : '...'} to retire.
                    With your current savings and monthly contributions, you can achieve FIRE in approximately {fireResult?.yearsToFire || '...'} years.
                    After retirement, you can withdraw {fireResult ? format(fireResult.monthlyIncome) : '...'} per month (4% rule).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Calculator */}
          <TabsContent value="tax" className="space-y-6">
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  Tax Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your income tax liability (New Tax Regime) in {symbol}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-income">Annual Income ({symbol})</Label>
                    <Input
                      id="tax-income"
                      type="number"
                      value={taxIncome}
                      onChange={(e) => setTaxIncome(e.target.value)}
                      placeholder="1000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-deductions">Deductions ({symbol})</Label>
                    <Input
                      id="tax-deductions"
                      type="number"
                      value={taxDeductions}
                      onChange={(e) => setTaxDeductions(e.target.value)}
                      placeholder="150000"
                    />
                  </div>
                </div>

                <Button onClick={calculateTax} className="w-full" size="lg">
                  Calculate Tax
                </Button>

                {taxResult && (
                  <div className="grid md:grid-cols-3 gap-4 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-chart-1/10 border-2 border-primary/20">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Taxable Income</p>
                      <p className="text-2xl font-bold">{format(taxResult.taxableIncome)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Tax Liability</p>
                      <p className="text-2xl font-bold text-destructive">{format(taxResult.tax)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Net Income</p>
                      <p className="text-2xl font-bold text-green-500">{format(taxResult.netIncome)}</p>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <p className="font-semibold mb-2">💡 Plain Language Explanation:</p>
                  <p>
                    Your annual income of {format(parseFloat(taxIncome))} minus deductions of {format(parseFloat(taxDeductions))} gives you a taxable income of {taxResult ? format(taxResult.taxableIncome) : '...'}.
                    Your tax liability is {taxResult ? format(taxResult.tax) : '...'}, leaving you with a net income of {taxResult ? format(taxResult.netIncome) : '...'}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
