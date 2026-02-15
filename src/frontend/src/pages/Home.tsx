import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, TrendingUp, Brain, Target, Sparkles, CheckCircle2, BarChart3, Calculator, GraduationCap } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized financial recommendations powered by advanced machine learning models',
      color: 'text-primary',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Track your spending, income, and savings with live updates and beautiful visualizations',
      color: 'text-chart-1',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your data is protected with military-grade encryption and blockchain technology',
      color: 'text-chart-2',
    },
    {
      icon: Target,
      title: 'Smart Goal Tracking',
      description: 'Set financial goals and watch your progress with AI-powered timeline predictions',
      color: 'text-chart-3',
    },
    {
      icon: Calculator,
      title: 'Financial Calculators',
      description: 'Plan your investments with SIP, EMI, FIRE, and tax calculators',
      color: 'text-chart-4',
    },
    {
      icon: GraduationCap,
      title: 'Educational Content',
      description: 'Learn finance through interactive lessons, 100 quiz questions, and video tutorials',
      color: 'text-chart-5',
    },
  ];

  const stats = [
    { value: '100%', label: 'Free Forever' },
    { value: '100+', label: 'Quiz Questions' },
    { value: '3', label: 'AI Models' },
    { value: '24/7', label: 'AI Assistant' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-chart-1/5 to-chart-2/5 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <span className="text-sm font-medium text-primary">🚀 100% Free • No Hidden Fees • No Premium Tiers</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent leading-tight">
              Master Your Finances with AI-Powered Insights
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              FinanceWise AI combines cutting-edge artificial intelligence with intuitive design to help you take control of your financial future. Track expenses, set goals, and get personalized recommendations—all for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate({ to: '/login' })} className="bg-gradient-to-r from-primary to-chart-1 text-lg px-8">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/how-it-works' })} className="text-lg px-8">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-border/40">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
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
              Everything you need to manage, analyze, and grow your wealth in one comprehensive platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                  <CardHeader>
                    <Icon className={`w-10 h-10 ${feature.color} mb-2`} />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">Simple, Powerful, Effective</h2>
            <p className="text-xl text-muted-foreground">
              Get started in minutes and take control of your financial future
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-chart-1 flex items-center justify-center text-white font-bold text-xl mx-auto">
                  1
                </div>
                <h3 className="font-semibold text-lg">Sign Up Free</h3>
                <p className="text-muted-foreground">Create your account with Internet Identity in seconds</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-chart-1 to-chart-2 flex items-center justify-center text-white font-bold text-xl mx-auto">
                  2
                </div>
                <h3 className="font-semibold text-lg">Add Your Data</h3>
                <p className="text-muted-foreground">Track transactions, set goals, and input your financial information</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-chart-2 to-chart-3 flex items-center justify-center text-white font-bold text-xl mx-auto">
                  3
                </div>
                <h3 className="font-semibold text-lg">Get AI Insights</h3>
                <p className="text-muted-foreground">Receive personalized recommendations and watch your wealth grow</p>
              </div>
            </div>
            <Button size="lg" onClick={() => navigate({ to: '/how-it-works' })} variant="outline" className="mt-8">
              See Full Process
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Bank-Level Security</h3>
                  <p className="text-sm text-muted-foreground">Military-grade encryption protects your data</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <CheckCircle2 className="w-12 h-12 text-chart-1 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">100% Free</h3>
                  <p className="text-sm text-muted-foreground">All features available at no cost forever</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Sparkles className="w-12 h-12 text-chart-2 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">Advanced machine learning for smart insights</p>
                </CardContent>
              </Card>
            </div>
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate({ to: '/login' })} className="bg-gradient-to-r from-primary to-chart-1">
                  Start Your Journey Today
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
