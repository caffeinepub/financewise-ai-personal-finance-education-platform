import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Sparkles, TrendingUp, Calendar } from 'lucide-react';

export default function Updates() {
  const updates = [
    {
      version: 'v2.0.0',
      date: 'January 2026',
      title: 'Major Update: 100 Quiz Questions & Video Lessons',
      features: [
        'Added 100 comprehensive quiz questions',
        'Integrated video lessons for all topics',
        'Enhanced AI insights with 3 ML models',
        'Improved real-time analytics',
      ],
    },
    {
      version: 'v1.5.0',
      date: 'December 2025',
      title: 'Enhanced Security & Privacy',
      features: [
        'Blockchain-based data storage',
        'Internet Identity integration',
        'Zero-knowledge architecture',
        'Enhanced encryption protocols',
      ],
    },
    {
      version: 'v1.0.0',
      date: 'November 2025',
      title: 'Initial Launch',
      features: [
        'Core financial tracking features',
        'AI-powered insights',
        'Goal tracking system',
        'Investment calculators',
      ],
    },
  ];

  const roadmap = [
    {
      title: 'Mobile App',
      description: 'Native iOS and Android applications',
      status: 'Coming Soon',
    },
    {
      title: 'Bank Integration',
      description: 'Automatic transaction import from banks',
      status: 'In Development',
    },
    {
      title: 'Advanced AI Models',
      description: 'More sophisticated prediction algorithms',
      status: 'Planned',
    },
    {
      title: 'Social Features',
      description: 'Share goals and achievements with friends',
      status: 'Planned',
    },
    {
      title: 'Multi-Currency Support',
      description: 'Support for 50+ currencies',
      status: 'Planned',
    },
    {
      title: 'Tax Filing Integration',
      description: 'Automated tax preparation assistance',
      status: 'Planned',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Updates & Roadmap
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what's new and what's coming next
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              Recent Updates
            </h2>
            {updates.map((update, index) => (
              <Card key={index} className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{update.title}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {update.version} • {update.date}
                      </CardDescription>
                    </div>
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {update.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Rocket className="w-8 h-8 text-chart-1" />
              Coming Soon
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {roadmap.map((item, index) => (
                <Card key={index} className="border-2 border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {item.status}
                      </span>
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
