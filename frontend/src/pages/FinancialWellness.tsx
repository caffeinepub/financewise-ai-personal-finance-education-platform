import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Shield, Smile, TrendingUp, Users } from 'lucide-react';

export default function FinancialWellness() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Financial Wellness
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A holistic approach to financial health and emotional well-being
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Emotional Comfort</CardTitle>
                <CardDescription>
                  Reduce financial stress with clear insights and actionable recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-chart-1/20">
              <CardHeader>
                <Brain className="w-12 h-12 text-chart-1 mb-4" />
                <CardTitle>Financial Psychology</CardTitle>
                <CardDescription>
                  Understand your money mindset and build healthier financial habits
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-chart-2/20">
              <CardHeader>
                <Shield className="w-12 h-12 text-chart-2 mb-4" />
                <CardTitle>Security & Trust</CardTitle>
                <CardDescription>
                  Feel safe knowing your data is protected with bank-level security
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-chart-3/20">
              <CardHeader>
                <Smile className="w-12 h-12 text-chart-3 mb-4" />
                <CardTitle>Peace of Mind</CardTitle>
                <CardDescription>
                  Track progress toward goals and celebrate financial milestones
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-chart-4/20">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-chart-4 mb-4" />
                <CardTitle>Growth Mindset</CardTitle>
                <CardDescription>
                  Learn and improve with educational content and personalized coaching
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-chart-5/20">
              <CardHeader>
                <Users className="w-12 h-12 text-chart-5 mb-4" />
                <CardTitle>Community Support</CardTitle>
                <CardDescription>
                  Join a community of users working toward financial independence
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
