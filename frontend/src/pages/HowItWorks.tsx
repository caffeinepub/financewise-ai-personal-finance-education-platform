import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Database, Brain, TrendingUp, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up with Internet Identity for secure, password-free authentication',
      details: [
        'No passwords to remember',
        'Biometric authentication support',
        'Complete privacy protection',
        'Takes less than 60 seconds',
      ],
      color: 'from-primary to-chart-1',
    },
    {
      icon: Database,
      title: 'Add Your Financial Data',
      description: 'Input your transactions, income, expenses, and financial goals',
      details: [
        'Manual transaction entry',
        'Categorize expenses automatically',
        'Set up recurring transactions',
        'Import historical data',
      ],
      color: 'from-chart-1 to-chart-2',
    },
    {
      icon: Brain,
      title: 'AI Analyzes Your Data',
      description: 'Our advanced AI models process your financial information',
      details: [
        'Linear Regression for trends',
        'GRU for pattern recognition',
        'LSTM for future predictions',
        'Real-time analysis',
      ],
      color: 'from-chart-2 to-chart-3',
    },
    {
      icon: TrendingUp,
      title: 'Get Personalized Insights',
      description: 'Receive AI-powered recommendations tailored to your situation',
      details: [
        'Spending optimization tips',
        'Savings opportunities',
        'Investment suggestions',
        'Risk assessment',
      ],
      color: 'from-chart-3 to-chart-4',
    },
    {
      icon: Target,
      title: 'Set and Track Goals',
      description: 'Define your financial objectives and monitor progress',
      details: [
        'Savings goals with deadlines',
        'Investment targets',
        'Debt payoff plans',
        'Visual progress tracking',
      ],
      color: 'from-chart-4 to-chart-5',
    },
    {
      icon: CheckCircle2,
      title: 'Achieve Financial Success',
      description: 'Watch your wealth grow with continuous AI guidance',
      details: [
        'Real-time dashboard updates',
        'Achievement notifications',
        'Milestone celebrations',
        'Ongoing optimization',
      ],
      color: 'from-chart-5 to-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              How FinanceWise AI Works
            </h1>
            <p className="text-xl text-muted-foreground">
              A simple, step-by-step guide to mastering your finances with AI-powered intelligence
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="border-2 border-primary/20 hover:border-primary/40 transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-2xl shrink-0`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-8 h-8 text-primary" />
                          <CardTitle className="text-2xl">{step.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">{step.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="ml-22 pl-6 border-l-2 border-primary/20">
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground">
                Join FinanceWise AI today and start your journey to financial freedom
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate({ to: '/login' })} className="bg-gradient-to-r from-primary to-chart-1">
                  Sign Up Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/features' })}>
                  Explore Features
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
