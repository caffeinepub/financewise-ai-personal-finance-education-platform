import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function PublicHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              AI-Powered Financial Intelligence
            </h1>
            <p className="text-xl text-muted-foreground">
              Take control of your finances with smart insights, real-time analytics, and personalized recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate({ to: '/login' })} className="bg-gradient-to-r from-primary to-chart-1">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/features' })}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6 text-center space-y-4">
                <Brain className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">AI Insights</h3>
                <p className="text-muted-foreground">
                  Get personalized recommendations powered by advanced machine learning
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6 text-center space-y-4">
                <TrendingUp className="w-12 h-12 text-chart-1 mx-auto" />
                <h3 className="text-xl font-semibold">Real-Time Analytics</h3>
                <p className="text-muted-foreground">
                  Track your financial health with live updates and beautiful charts
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6 text-center space-y-4">
                <Shield className="w-12 h-12 text-chart-2 mx-auto" />
                <h3 className="text-xl font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your data is protected with bank-level encryption on the blockchain
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Transform Your Finances?</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of users taking control of their financial future
              </p>
              <Button size="lg" onClick={() => navigate({ to: '/login' })} className="bg-gradient-to-r from-primary to-chart-1">
                Start Your Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
