import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, TrendingUp, Shield, Clock, Heart, Zap } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Improve Financial Health',
      description: 'Make better financial decisions with AI-powered insights and recommendations.',
    },
    {
      icon: Shield,
      title: 'Complete Privacy',
      description: 'Your data is encrypted and never shared with third parties.',
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate expense tracking and get instant financial analysis.',
    },
    {
      icon: Heart,
      title: 'Reduce Stress',
      description: 'Feel confident about your finances with clear insights and goal tracking.',
    },
    {
      icon: Zap,
      title: 'Achieve Goals Faster',
      description: 'AI-powered predictions help you reach your financial goals sooner.',
    },
    {
      icon: CheckCircle2,
      title: '100% Free',
      description: 'All features available at no cost, forever.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Why Choose FinanceWise AI?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your financial life with these powerful benefits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
                  <CardHeader>
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
