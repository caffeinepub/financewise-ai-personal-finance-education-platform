import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Sparkles, Rocket } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Roadmap() {
  const completed = [
    {
      version: 'v1.0',
      date: 'January 2025',
      features: [
        'Internet Identity authentication',
        'Transaction tracking and categorization',
        'AI-powered insights with 3 ML models',
        'Savings goals management',
        'Real-time analytics dashboard',
        'Investment portfolio tracking',
        'Loans & EMI management',
        'Financial calculators (SIP, EMI, FIRE, Tax)',
        'Money psychology assessment',
        '100 educational quiz questions',
        'Video learning content',
        'Security & privacy controls',
      ],
    },
  ];

  const upcoming = [
    {
      title: 'Mobile App',
      description: 'Native iOS and Android applications',
      status: 'In Development',
      eta: 'Q2 2025',
      icon: Rocket,
    },
    {
      title: 'Bank Integration',
      description: 'Automatic transaction import from banks',
      status: 'Planned',
      eta: 'Q3 2025',
      icon: Sparkles,
    },
    {
      title: 'Advanced AI Models',
      description: 'Enhanced prediction accuracy with GPT integration',
      status: 'Research',
      eta: 'Q4 2025',
      icon: Sparkles,
    },
    {
      title: 'Multi-Currency Support',
      description: 'Support for 50+ global currencies',
      status: 'Planned',
      eta: 'Q2 2025',
      icon: Clock,
    },
    {
      title: 'Social Features',
      description: 'Share goals and compete with friends',
      status: 'Planned',
      eta: 'Q3 2025',
      icon: Clock,
    },
    {
      title: 'Tax Filing Integration',
      description: 'Automated tax preparation and filing',
      status: 'Research',
      eta: 'Q4 2025',
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              Product Roadmap
            </h1>
            <p className="text-xl text-muted-foreground">
              See what we've built and what's coming next for FinanceWise AI
            </p>
          </div>
        </div>
      </section>

      {/* Completed Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <h2 className="text-3xl font-bold">Completed Features</h2>
            </div>

            {completed.map((release, index) => (
              <Card key={index} className="border-2 border-green-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{release.version}</CardTitle>
                      <CardDescription>{release.date}</CardDescription>
                    </div>
                    <Badge className="bg-green-500">Released</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {release.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">What's Coming</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {upcoming.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="border-2 border-primary/20 hover:border-primary/40 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-8 h-8 text-primary" />
                          <div>
                            <CardTitle>{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{feature.status}</Badge>
                        <span className="text-sm text-muted-foreground">ETA: {feature.eta}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Community Input */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Have a Feature Request?</h2>
              <p className="text-xl text-muted-foreground">
                We'd love to hear your ideas! Contact us to suggest new features or vote on upcoming additions.
              </p>
              <a href="/contact" className="inline-block">
                <Badge className="text-lg px-6 py-2 cursor-pointer hover:bg-primary/90">
                  Share Your Ideas
                </Badge>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
