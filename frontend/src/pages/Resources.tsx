import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Video, Calculator, GraduationCap, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Resources() {
  const navigate = useNavigate();

  const resourceCategories = [
    {
      icon: BookOpen,
      title: 'Educational Guides',
      description: 'Comprehensive guides on budgeting, saving, investing, and financial planning',
      items: [
        'Complete Budgeting Guide',
        'Emergency Fund Planning',
        'Investment Basics for Beginners',
        'Debt Management Strategies',
      ],
      action: () => navigate({ to: '/blog' }),
      color: 'text-primary',
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video lessons on using FinanceWise AI and financial concepts',
      items: [
        'Getting Started with FinanceWise AI',
        'Understanding AI Insights',
        'Setting Financial Goals',
        'Using Financial Calculators',
      ],
      action: () => navigate({ to: '/learning' }),
      color: 'text-chart-1',
    },
    {
      icon: Calculator,
      title: 'Financial Calculators',
      description: 'Interactive tools for SIP, EMI, FIRE, tax planning, and investment calculations',
      items: [
        'SIP Calculator',
        'EMI Calculator',
        'FIRE Calculator',
        'Tax Calculator',
      ],
      action: () => navigate({ to: '/calculators' }),
      color: 'text-chart-2',
    },
    {
      icon: GraduationCap,
      title: 'Learning Paths',
      description: 'Structured courses on personal finance, investing, and wealth building',
      items: [
        'Personal Finance 101',
        'Investment Fundamentals',
        'Advanced Portfolio Management',
        'Tax Optimization Strategies',
      ],
      action: () => navigate({ to: '/learning' }),
      color: 'text-chart-3',
    },
    {
      icon: FileText,
      title: 'Templates & Tools',
      description: 'Downloadable templates for budgeting, goal tracking, and financial planning',
      items: [
        'Monthly Budget Template',
        'Goal Tracker Worksheet',
        'Net Worth Calculator',
        'Expense Log Template',
      ],
      action: () => {},
      color: 'text-chart-4',
    },
    {
      icon: Download,
      title: 'Blog Articles',
      description: 'In-depth articles on financial topics, market trends, and money management',
      items: [
        'Latest Financial News',
        'Investment Strategies',
        'Saving Tips & Tricks',
        'Market Analysis',
      ],
      action: () => navigate({ to: '/blog' }),
      color: 'text-chart-5',
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
              Financial Resources
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to master your finances—guides, calculators, videos, and more
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                  <CardHeader>
                    <Icon className={`w-10 h-10 ${category.color} mb-2`} />
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {category.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button onClick={category.action} variant="outline" className="w-full">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Start Learning?</h2>
              <p className="text-xl text-muted-foreground">
                Access all resources for free with your FinanceWise AI account
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate({ to: '/login' })} className="bg-gradient-to-r from-primary to-chart-1">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/blog' })}>
                  Browse Blog
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
