import React from 'react';
import { Link } from '@tanstack/react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSEO } from '../hooks/useSEO';
import {
  Brain,
  BarChart3,
  Shield,
  Target,
  TrendingUp,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Zap,
  Lock,
  PieChart,
  BookOpen,
  Award,
  Clock,
} from 'lucide-react';

const AdSensePlaceholder: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`adsense-container ${className}`}>
    {/* AdSense Ad Unit: Replace with your ad code */}
    <div className="w-full min-h-[90px] bg-muted/30 border border-border/50 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
      <span className="opacity-50">Advertisement</span>
    </div>
  </div>
);

export default function Home() {
  useSEO(
    'FinanceWise AI – Free AI Budget Planner & Personal Finance Manager',
    'FinanceWise AI helps you track income, expenses and plan budgets using artificial intelligence. Free, secure, and easy to use.'
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Personal Finance
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Take Control of Your{' '}
            <span className="text-primary">Financial Future</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            FinanceWise AI combines artificial intelligence with intuitive budgeting tools to help
            you track expenses, plan budgets, achieve savings goals, and make smarter money
            decisions — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 border border-border px-8 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              How It Works
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> 100% Free</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> No Credit Card</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Blockchain Secure</span>
          </div>
        </div>
      </section>

      {/* What is FinanceWise AI Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">What is FinanceWise AI?</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              FinanceWise AI is a comprehensive personal finance management platform that harnesses
              the power of artificial intelligence to help individuals and families take control of
              their financial lives. Unlike traditional budgeting apps that simply record
              transactions, FinanceWise AI actively analyzes your financial patterns, identifies
              opportunities for improvement, and provides personalized recommendations tailored to
              your unique situation.
            </p>
            <p>
              At its core, FinanceWise AI is designed for anyone who wants to improve their
              financial health — whether you are a recent graduate managing your first salary, a
              growing family trying to balance multiple financial goals, or a seasoned professional
              looking to optimize your wealth-building strategy. The platform adapts to your needs
              and grows with you as your financial situation evolves.
            </p>
            <p>
              What sets FinanceWise AI apart from other financial tools is its use of advanced
              machine learning models — including Linear Regression, GRU (Gated Recurrent Unit),
              and LSTM (Long Short-Term Memory) networks — to analyze your financial data and
              generate insights that would previously require a professional financial advisor.
              These AI models learn from your spending patterns, identify trends, predict future
              expenses, and provide actionable recommendations to help you reach your financial
              goals faster.
            </p>
            <p>
              Security and privacy are foundational to FinanceWise AI. Built on the Internet
              Computer blockchain, your financial data is protected by military-grade encryption
              and a zero-knowledge architecture that ensures even the platform itself cannot access
              your personal financial information. You authenticate using Internet Identity — a
              passwordless, phishing-resistant authentication system — eliminating the risk of
              password theft or account compromise.
            </p>
            <p>
              FinanceWise AI is completely free to use. We believe that access to sophisticated
              financial tools should not be limited to those who can afford professional advisors.
              Our mission is to democratize financial intelligence and help everyone — regardless
              of income level — build a secure financial future.
            </p>
          </div>
        </div>
      </section>

      {/* AdSense Placeholder - After "What is FinanceWise AI?" section */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <AdSensePlaceholder />
      </div>

      {/* Smart Budget Planning Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <DollarSign className="w-4 h-4" />
                Smart Budget Planning
              </div>
              <h2 className="text-3xl font-bold mb-4">Manage Your Income and Expenses with Intelligence</h2>
              <p className="text-muted-foreground mb-4">
                Effective budget planning is the foundation of financial success. FinanceWise AI
                makes budgeting effortless with an intelligent budget planner that automatically
                allocates your income across spending categories based on proven financial
                frameworks like the 50/30/20 rule.
              </p>
              <p className="text-muted-foreground mb-4">
                Choose from five budget modes — Beginner, Student, Professional, Family, and
                Aggressive Saving — each designed for different life stages and financial goals.
                The AI analyzes your actual spending patterns and suggests adjustments to keep
                you on track.
              </p>
              <p className="text-muted-foreground mb-6">
                With real-time budget tracking, you always know exactly how much you have left
                in each category. Visual charts and progress indicators make it easy to see
                your budget health at a glance, and AI-powered alerts warn you before you
                overspend.
              </p>
              <ul className="space-y-2">
                {['5 budget modes for every life stage', 'AI-powered category recommendations', 'Real-time spending alerts', 'Visual budget health dashboard'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/assets/generated/budget-planner-screenshot.dim_800x500.png"
                alt="FinanceWise AI Budget Planner"
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="p-6">
                <h3 className="font-semibold mb-2">Smart Budget Planner</h3>
                <p className="text-sm text-muted-foreground">AI-powered budget allocation with real-time tracking and personalized recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expense Tracking Guide Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/assets/generated/expense-tracker-screenshot.dim_800x500.png"
                alt="FinanceWise AI Expense Tracker"
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="p-6">
                <h3 className="font-semibold mb-2">Expense Tracker</h3>
                <p className="text-sm text-muted-foreground">Track every transaction with automatic categorization and spending pattern analysis.</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <BarChart3 className="w-4 h-4" />
                Expense Tracking
              </div>
              <h2 className="text-3xl font-bold mb-4">Track Every Rupee, Understand Every Pattern</h2>
              <p className="text-muted-foreground mb-4">
                Most people are surprised when they first see a detailed breakdown of their
                spending. FinanceWise AI makes expense tracking effortless — log transactions
                in seconds, and the AI automatically categorizes them and identifies patterns
                you might never notice on your own.
              </p>
              <p className="text-muted-foreground mb-4">
                The expense tracker supports multiple payment types (cash, UPI, credit card,
                debit card, net banking), priority levels, and custom tags, giving you a
                complete picture of your spending behavior. Monthly comparisons show you
                whether your spending is trending up or down in each category.
              </p>
              <p className="text-muted-foreground mb-6">
                Advanced analytics reveal your top spending categories, identify unusual
                expenses, and show you exactly where your money goes each month. This
                awareness is the first step toward meaningful financial improvement.
              </p>
              <ul className="space-y-2">
                {['Automatic transaction categorization', 'Multiple payment type support', 'Monthly spending comparisons', 'Category trend analysis'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Financial Insights Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Brain className="w-4 h-4" />
                AI Financial Insights
              </div>
              <h2 className="text-3xl font-bold mb-4">AI That Understands Your Financial Life</h2>
              <p className="text-muted-foreground mb-4">
                FinanceWise AI's artificial intelligence engine goes beyond simple calculations.
                Using three sophisticated machine learning models — Linear Regression for trend
                analysis, GRU for sequential pattern recognition, and LSTM for long-term
                forecasting — the AI builds a comprehensive understanding of your financial
                behavior.
              </p>
              <p className="text-muted-foreground mb-4">
                The AI analyzes your income patterns, spending habits, savings rate, and goal
                progress to generate personalized insights. It identifies opportunities you
                might miss — like a subscription you forgot about, a spending category that
                has been creeping up, or a savings opportunity based on your income pattern.
              </p>
              <p className="text-muted-foreground mb-6">
                Three-month financial forecasts help you plan ahead, while risk assessments
                give you an honest picture of your financial health. The AI chatbot answers
                your financial questions in plain language, making sophisticated financial
                analysis accessible to everyone.
              </p>
              <ul className="space-y-2">
                {['3 ML models for comprehensive analysis', '3-month financial forecasting', 'Personalized savings recommendations', 'AI chatbot for financial questions'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/assets/generated/analytics-screenshot.dim_800x500.png"
                alt="FinanceWise AI Analytics"
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="p-6">
                <h3 className="font-semibold mb-2">AI Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">Comprehensive financial analytics powered by three machine learning models.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Finance Education Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Personal Finance Education</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Financial literacy is the foundation of financial success. FinanceWise AI is not
              just a tool — it is a learning platform that helps you understand the principles
              behind good financial decisions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <DollarSign className="w-6 h-6" />,
                title: 'The Importance of Budgeting',
                desc: 'A budget is not a restriction — it is a plan. Learn how budgeting gives you control over your money and helps you achieve your goals faster.',
                color: 'text-blue-500',
                bg: 'bg-blue-500/10',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'The Art of Saving Money',
                desc: 'Saving is a skill that improves with practice. Discover proven strategies to build your savings rate without feeling deprived.',
                color: 'text-green-500',
                bg: 'bg-green-500/10',
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Controlling Your Expenses',
                desc: 'Understanding where your money goes is the first step to controlling it. Learn to identify and eliminate unnecessary spending.',
                color: 'text-orange-500',
                bg: 'bg-orange-500/10',
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: 'Financial Planning Basics',
                desc: 'From emergency funds to retirement planning, learn the fundamental concepts that form the foundation of long-term financial security.',
                color: 'text-purple-500',
                bg: 'bg-purple-500/10',
              },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-xl p-6">
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Read Our Finance Blog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose FinanceWise AI Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose FinanceWise AI?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thousands of users trust FinanceWise AI to manage their personal finances.
              Here is what makes us different.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Award className="w-6 h-6" />,
                title: 'Completely Free',
                desc: 'Every feature — AI insights, budget planner, expense tracker, analytics, quiz — is available at no cost. No premium tiers, no hidden fees.',
                color: 'text-yellow-500',
                bg: 'bg-yellow-500/10',
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'Blockchain-Secured',
                desc: 'Your financial data is stored on the Internet Computer blockchain with AES-256 encryption and a zero-knowledge architecture.',
                color: 'text-blue-500',
                bg: 'bg-blue-500/10',
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: 'AI-Powered Insights',
                desc: 'Three machine learning models analyze your finances and provide personalized recommendations that improve over time.',
                color: 'text-purple-500',
                bg: 'bg-purple-500/10',
              },
              {
                icon: <PieChart className="w-6 h-6" />,
                title: 'Smart Analytics',
                desc: 'Comprehensive charts and reports give you a complete picture of your financial health, from daily spending to long-term trends.',
                color: 'text-green-500',
                bg: 'bg-green-500/10',
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Goal Tracking',
                desc: 'Set savings goals and track your progress with AI-powered feasibility analysis and personalized coaching.',
                color: 'text-orange-500',
                bg: 'bg-orange-500/10',
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: 'Financial Education',
                desc: 'Learn personal finance through our 100-question quiz, educational blog, and AI-powered financial wellness guides.',
                color: 'text-teal-500',
                bg: 'bg-teal-500/10',
              },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-xl p-6">
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '100+', label: 'Quiz Questions', icon: <BookOpen className="w-6 h-6" /> },
              { value: '3', label: 'AI Models', icon: <Brain className="w-6 h-6" /> },
              { value: '10+', label: 'Finance Tools', icon: <BarChart3 className="w-6 h-6" /> },
              { value: '100%', label: 'Free Forever', icon: <Star className="w-6 h-6" /> },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-center mb-2 opacity-80">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-primary-foreground/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How FinanceWise AI Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started with FinanceWise AI takes less than 5 minutes. Here is how it works.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Free Account',
                desc: 'Sign up using Internet Identity — no password required. Your account is secured by blockchain technology from day one.',
                icon: <Users className="w-6 h-6" />,
              },
              {
                step: '02',
                title: 'Enter Your Financial Data',
                desc: 'Add your income sources and start logging transactions. The AI begins analyzing your patterns immediately.',
                icon: <DollarSign className="w-6 h-6" />,
              },
              {
                step: '03',
                title: 'Get AI-Powered Insights',
                desc: 'Receive personalized budget recommendations, spending analysis, and financial forecasts tailored to your situation.',
                icon: <Brain className="w-6 h-6" />,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-4xl font-bold text-primary/20 mb-2">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Master Your Finances</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              FinanceWise AI is a complete personal finance platform with tools for every aspect of your financial life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <DollarSign className="w-5 h-5" />, title: 'Budget Planner', desc: 'AI-powered budget allocation' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Expense Tracker', desc: 'Track every transaction' },
              { icon: <TrendingUp className="w-5 h-5" />, title: 'Income Manager', desc: 'Monitor all income sources' },
              { icon: <PieChart className="w-5 h-5" />, title: 'Analytics', desc: 'Comprehensive financial charts' },
              { icon: <Brain className="w-5 h-5" />, title: 'AI Insights', desc: 'ML-powered recommendations' },
              { icon: <Target className="w-5 h-5" />, title: 'Goal Tracker', desc: 'Set and achieve savings goals' },
              { icon: <BookOpen className="w-5 h-5" />, title: 'Finance Quiz', desc: '100 educational questions' },
              { icon: <Shield className="w-5 h-5" />, title: 'Security', desc: 'Blockchain-grade protection' },
            ].map((feature) => (
              <div key={feature.title} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/features"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Explore All Features <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built on Trust and Transparency</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your financial data is among the most sensitive information you have. We take that responsibility seriously.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Military-Grade Encryption',
                desc: 'AES-256 encryption protects all your financial data at rest and in transit. The same standard used by banks and governments worldwide.',
                color: 'text-blue-500',
                bg: 'bg-blue-500/10',
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: 'Zero-Knowledge Architecture',
                desc: 'We cannot see your financial data. Your information is encrypted before it leaves your device and only you hold the decryption keys.',
                color: 'text-green-500',
                bg: 'bg-green-500/10',
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Blockchain Permanence',
                desc: 'Data stored on the Internet Computer blockchain is immutable and tamper-proof. Your financial history is always accurate and verifiable.',
                color: 'text-purple-500',
                bg: 'bg-purple-500/10',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/security"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Learn About Our Security <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Financial Transformation Today
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of users who are already using FinanceWise AI to take control of
            their finances, build savings, and work toward financial freedom. It is free,
            secure, and takes less than 5 minutes to get started.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. No hidden fees. Cancel anytime.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
