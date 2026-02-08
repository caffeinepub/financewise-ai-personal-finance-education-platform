import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, TrendingUp, Brain, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              Master Your Finances with AI-Powered Insights
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              FinanceWise AI combines cutting-edge artificial intelligence with intuitive design to help you take control of your financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate({ to: '/signup' })} className="bg-gradient-to-r from-primary to-chart-1">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/how-it-works' })}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Powerful Features for Financial Success</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage, analyze, and grow your wealth in one place
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader>
                <Brain className="w-10 h-10 text-primary mb-2" />
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Get personalized financial recommendations powered by advanced machine learning
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 border-chart-1/20 hover:border-chart-1/40 transition-all">
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-chart-1 mb-2" />
                <CardTitle>Real-Time Analytics</CardTitle>
                <CardDescription>
                  Track your spending, income, and savings with live updates and beautiful visualizations
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 border-chart-2/20 hover:border-chart-2/40 transition-all">
              <CardHeader>
                <Shield className="w-10 h-10 text-chart-2 mb-2" />
                <CardTitle>Bank-Level Security</CardTitle>
                <CardDescription>
                  Your data is protected with military-grade encryption and blockchain technology
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 border-chart-3/20 hover:border-chart-3/40 transition-all">
              <CardHeader>
                <Target className="w-10 h-10 text-chart-3 mb-2" />
                <CardTitle>Smart Goal Tracking</CardTitle>
                <CardDescription>
                  Set financial goals and watch your progress with AI-powered timeline predictions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 border-chart-4/20 hover:border-chart-4/40 transition-all">
              <CardHeader>
                <Sparkles className="w-10 h-10 text-chart-4 mb-2" />
                <CardTitle>Educational Content</CardTitle>
                <CardDescription>
                  Learn finance through interactive lessons, quizzes, and video tutorials
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 border-chart-5/20 hover:border-chart-5/40 transition-all">
              <CardHeader>
                <CheckCircle2 className="w-10 h-10 text-chart-5 mb-2" />
                <CardTitle>100% Free</CardTitle>
                <CardDescription>
                  All features available at no cost. No hidden fees, no premium tiers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Transform Your Financial Life?</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of users who are already taking control of their finances with FinanceWise AI
              </p>
              <Button size="lg" onClick={() => navigate({ to: '/signup' })} className="bg-gradient-to-r from-primary to-chart-1">
                Start Your Journey Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
