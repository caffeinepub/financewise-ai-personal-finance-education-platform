import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, Home, Baby, Plane, TrendingUp } from 'lucide-react';

export default function UseCases() {
  const useCases = [
    {
      icon: GraduationCap,
      title: 'Students & Young Professionals',
      description: 'Learn to budget, save for goals, and build healthy financial habits early.',
      scenarios: ['Track student loans', 'Budget for first apartment', 'Save for career development'],
    },
    {
      icon: Briefcase,
      title: 'Working Professionals',
      description: 'Optimize income, plan investments, and achieve financial independence.',
      scenarios: ['Maximize tax savings', 'Build investment portfolio', 'Plan for FIRE'],
    },
    {
      icon: Home,
      title: 'Homeowners',
      description: 'Manage mortgages, track home expenses, and plan renovations.',
      scenarios: ['EMI optimization', 'Home maintenance budget', 'Property investment tracking'],
    },
    {
      icon: Baby,
      title: 'Growing Families',
      description: 'Plan for children\'s education, manage family expenses, and secure the future.',
      scenarios: ['Education fund planning', 'Family budget management', 'Insurance optimization'],
    },
    {
      icon: Plane,
      title: 'Travel Enthusiasts',
      description: 'Save for dream vacations and manage travel expenses efficiently.',
      scenarios: ['Vacation savings goals', 'Travel expense tracking', 'Currency management'],
    },
    {
      icon: TrendingUp,
      title: 'Investors',
      description: 'Track portfolio performance, analyze returns, and optimize investments.',
      scenarios: ['Portfolio diversification', 'ROI analysis', 'Risk assessment'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Use Cases
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              FinanceWise AI adapts to your unique financial journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Card key={index} className="border-2 border-border/50 hover:border-primary/40 transition-all">
                  <CardHeader>
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                    <CardDescription className="text-base">{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {useCase.scenarios.map((scenario, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {scenario}
                        </li>
                      ))}
                    </ul>
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
