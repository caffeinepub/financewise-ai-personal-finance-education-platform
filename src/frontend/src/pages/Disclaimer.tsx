import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, Brain, Shield, Scale, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Disclaimer
            </h1>
            <p className="text-muted-foreground">Last updated: January 31, 2026</p>
          </div>

          <Card className="border-2 border-destructive/50 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-destructive" />
                <CardTitle className="text-2xl text-destructive">Important Notice</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="font-semibold text-foreground">
                Please read this disclaimer carefully before using FinanceWise AI.
              </p>
              <p>
                The information provided by FinanceWise AI is for educational and informational purposes only. It should not be considered as financial, investment, tax, or legal advice.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Info className="w-8 h-8 text-chart-1" />
                <CardTitle className="text-xl">Educational Purpose Only</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                FinanceWise AI is designed as an educational tool to help you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Learn about personal finance management</li>
                <li>Track your income and expenses</li>
                <li>Set and monitor financial goals</li>
                <li>Understand basic financial concepts</li>
              </ul>
              <p className="mt-4 font-semibold text-foreground">
                It is NOT a substitute for professional financial advice.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Scale className="w-8 h-8 text-chart-2" />
                <CardTitle className="text-xl">Not Financial Advice</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                FinanceWise AI does not provide:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Investment recommendations or advice</li>
                <li>Tax planning or preparation services</li>
                <li>Legal or regulatory guidance</li>
                <li>Personalized financial planning</li>
                <li>Securities trading or brokerage services</li>
              </ul>
              <p className="mt-4">
                Always consult with qualified financial advisors, tax professionals, or legal experts before making important financial decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-chart-3" />
                <CardTitle className="text-xl">AI-Generated Content</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our AI-powered features use machine learning algorithms to analyze your financial data and provide insights. However:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI predictions are based on historical patterns and may not be accurate</li>
                <li>Algorithms cannot account for unexpected life events or market changes</li>
                <li>AI recommendations should be verified with professional advisors</li>
                <li>Machine learning models have inherent limitations and biases</li>
              </ul>
              <p className="mt-4 font-semibold text-foreground">
                AI insights are for educational purposes only and should not be the sole basis for financial decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-chart-4" />
                <CardTitle className="text-xl">Investment Risks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="font-semibold text-foreground">
                All investments carry risk. You could lose some or all of your invested capital.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Past performance does not guarantee future results</li>
                <li>Market conditions can change rapidly and unpredictably</li>
                <li>Diversification does not eliminate risk</li>
                <li>Higher returns typically come with higher risk</li>
              </ul>
              <p className="mt-4">
                Before investing, carefully consider your financial situation, risk tolerance, and investment objectives.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">No Guarantees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We make no guarantees or warranties about:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The accuracy or completeness of information provided</li>
                <li>Financial outcomes or results from using our service</li>
                <li>Achievement of your financial goals</li>
                <li>The performance of any investment or strategy</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">User Responsibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By using FinanceWise AI, you acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are solely responsible for your financial decisions</li>
                <li>You will verify all information before acting on it</li>
                <li>You understand the risks involved in financial planning and investing</li>
                <li>You will seek professional advice when needed</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Third-Party Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our platform may contain links to third-party websites or display third-party advertisements. We are not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The accuracy of third-party content</li>
                <li>The privacy practices of external websites</li>
                <li>Products or services advertised by third parties</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-chart-5" />
                <CardTitle className="text-xl">Limitation of Liability</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                To the maximum extent permitted by law, FinanceWise AI and its creators shall not be liable for any:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Financial losses resulting from use of our service</li>
                <li>Decisions made based on information provided</li>
                <li>Errors or omissions in content or calculations</li>
                <li>Interruptions or unavailability of service</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                FinanceWise AI is not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A registered investment advisor</li>
                <li>A licensed financial planner</li>
                <li>A securities broker or dealer</li>
                <li>A tax preparation service</li>
              </ul>
              <p className="mt-4">
                We do not provide services that require regulatory licenses or registrations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardHeader>
              <CardTitle className="text-xl">Questions or Concerns?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about this disclaimer or need clarification, please contact us:
              </p>
              <p className="font-semibold text-foreground">
                Email: fwiseai@gmail.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
