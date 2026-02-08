import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Eye, Heart, Users, Zap, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              About FinanceWise AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering individuals to take control of their financial future
            </p>
          </div>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardHeader>
              <CardTitle className="text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                FinanceWise AI was created to democratize financial management and education. We believe everyone deserves access to powerful financial tools and AI-powered insights, regardless of their income level or financial knowledge. Our mission is to help people make better financial decisions, reduce stress, and achieve their financial goals faster.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 border-border/50">
              <CardHeader>
                <Target className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Our Vision</CardTitle>
                <CardDescription>
                  A world where everyone has the knowledge and tools to achieve financial independence
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border/50">
              <CardHeader>
                <Heart className="w-12 h-12 text-chart-1 mb-4" />
                <CardTitle>Our Values</CardTitle>
                <CardDescription>
                  Privacy, transparency, education, and empowerment guide everything we do
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border/50">
              <CardHeader>
                <Users className="w-12 h-12 text-chart-2 mb-4" />
                <CardTitle>Our Community</CardTitle>
                <CardDescription>
                  Thousands of users worldwide trust FinanceWise AI for their financial management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border/50">
              <CardHeader>
                <Zap className="w-12 h-12 text-chart-3 mb-4" />
                <CardTitle>Innovation</CardTitle>
                <CardDescription>
                  Cutting-edge AI and blockchain technology for the best user experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border/50">
              <CardHeader>
                <Shield className="w-12 h-12 text-chart-4 mb-4" />
                <CardTitle>Security First</CardTitle>
                <CardDescription>
                  Bank-level security and privacy protection in everything we build
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border/50">
              <CardHeader>
                <Eye className="w-12 h-12 text-chart-5 mb-4" />
                <CardTitle>Transparency</CardTitle>
                <CardDescription>
                  Open about how our AI works and how we protect your data
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
