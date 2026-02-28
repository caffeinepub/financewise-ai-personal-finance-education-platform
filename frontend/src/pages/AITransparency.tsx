import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, AlertCircle, Shield } from 'lucide-react';

export default function AITransparency() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              How Our AI Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transparent, explainable AI for your financial decisions
            </p>
          </div>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardHeader>
              <Brain className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-3xl">Our AI Models</CardTitle>
              <CardDescription className="text-base">
                We use three complementary machine learning models to provide accurate financial insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">1. Linear Regression Model</h3>
                <p className="text-muted-foreground">
                  Analyzes historical spending patterns to predict future expenses and identify trends. Best for understanding long-term financial behavior.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">2. GRU (Gated Recurrent Unit)</h3>
                <p className="text-muted-foreground">
                  A neural network that captures short-term patterns and seasonal variations in your spending. Excellent for monthly budget predictions.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">3. LSTM (Long Short-Term Memory)</h3>
                <p className="text-muted-foreground">
                  Advanced neural network for complex pattern recognition. Identifies subtle relationships between different financial behaviors over time.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-chart-1/20">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-chart-1 mb-4" />
                <CardTitle>What Our AI Can Do</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-2" />
                    <span className="text-muted-foreground">Predict future expenses based on historical data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-2" />
                    <span className="text-muted-foreground">Identify spending patterns and anomalies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-2" />
                    <span className="text-muted-foreground">Recommend savings opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-2" />
                    <span className="text-muted-foreground">Estimate goal completion timelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-2" />
                    <span className="text-muted-foreground">Provide personalized financial advice</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-chart-2/20">
              <CardHeader>
                <AlertCircle className="w-12 h-12 text-chart-2 mb-4" />
                <CardTitle>AI Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2" />
                    <span className="text-muted-foreground">Predictions are estimates, not guarantees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2" />
                    <span className="text-muted-foreground">Requires sufficient historical data for accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2" />
                    <span className="text-muted-foreground">Cannot predict unexpected life events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2" />
                    <span className="text-muted-foreground">Not a substitute for professional financial advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2" />
                    <span className="text-muted-foreground">Educational purposes only</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-chart-3/20">
            <CardHeader>
              <Shield className="w-12 h-12 text-chart-3 mb-4" />
              <CardTitle>Privacy & Data Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your data is used exclusively to generate your personal insights. We never:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2" />
                  <span className="text-muted-foreground">Share your data with third parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2" />
                  <span className="text-muted-foreground">Use your data to train models for other users</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2" />
                  <span className="text-muted-foreground">Sell or monetize your financial information</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2" />
                  <span className="text-muted-foreground">Access your data without your explicit permission</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
