import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function Compare() {
  const features = [
    { name: 'AI-Powered Insights', financewise: true, others: false },
    { name: 'Real-Time Analytics', financewise: true, others: true },
    { name: 'Bank-Level Security', financewise: true, others: true },
    { name: 'Educational Content', financewise: true, others: false },
    { name: '100 Quiz Questions', financewise: true, others: false },
    { name: 'Video Lessons', financewise: true, others: false },
    { name: 'Goal Tracking', financewise: true, others: true },
    { name: 'Investment Calculators', financewise: true, others: false },
    { name: 'Money Psychology Tools', financewise: true, others: false },
    { name: 'Blockchain Storage', financewise: true, others: false },
    { name: 'Completely Free', financewise: true, others: false },
    { name: 'No Ads', financewise: true, others: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Compare FinanceWise AI
            </h1>
            <p className="text-xl text-muted-foreground">
              See how we stack up against other financial management tools
            </p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div></div>
                <CardTitle className="text-primary">FinanceWise AI</CardTitle>
                <CardTitle className="text-muted-foreground">Others</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="font-medium">{feature.name}</div>
                    <div className="flex justify-center">
                      {feature.financewise ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      {feature.others ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
