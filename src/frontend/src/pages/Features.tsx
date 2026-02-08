import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, Target, Shield, Calculator, BookOpen, PieChart, Wallet } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning algorithms analyze your spending patterns and provide personalized recommendations.',
      color: 'text-primary',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Live dashboards with beautiful charts and graphs showing your financial health at a glance.',
      color: 'text-chart-1',
    },
    {
      icon: Target,
      title: 'Smart Goal Tracking',
      description: 'Set financial goals and track progress with AI-powered timeline predictions and milestone celebrations.',
      color: 'text-chart-2',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Military-grade encryption and blockchain storage ensure your data is always protected.',
      color: 'text-chart-3',
    },
    {
      icon: Calculator,
      title: 'Financial Calculators',
      description: 'SIP, lumpsum, FIRE, and tax calculators help you make informed investment decisions.',
      color: 'text-chart-4',
    },
    {
      icon: BookOpen,
      title: 'Educational Content',
      description: '100 quiz questions, video lessons, and interactive tutorials to improve your financial literacy.',
      color: 'text-chart-5',
    },
    {
      icon: PieChart,
      title: 'Expense Tracking',
      description: 'Categorize and track all your expenses with automatic insights and spending alerts.',
      color: 'text-primary',
    },
    {
      icon: Wallet,
      title: 'Investment Portfolio',
      description: 'Track your investments, monitor performance, and get AI-powered diversification recommendations.',
      color: 'text-chart-1',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Powerful Features
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take control of your financial future
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 border-border/50 hover:border-primary/40 transition-all">
                  <CardHeader>
                    <Icon className={`w-12 h-12 ${feature.color} mb-4`} />
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
