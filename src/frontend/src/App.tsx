import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useQueries';
import AppLayout from './components/AppLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserProfile } from './backend';

// Private Pages (Authentication Required)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AIInsights from './pages/AIInsights';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Calculators from './pages/Calculators';
import MoneyPsychology from './pages/MoneyPsychology';
import Learning from './pages/Learning';
import Quiz from './pages/Quiz';
import Settings from './pages/Settings';
import Challenges from './pages/Challenges';
import BudgetPlanner from './pages/BudgetPlanner';

// Public Pages (No Authentication Required)
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Features from './pages/Features';
import Benefits from './pages/Benefits';
import SecurityPublic from './pages/Security';
import About from './pages/About';
import Resources from './pages/Resources';
import UseCases from './pages/UseCases';
import AIExplained from './pages/AITransparency';
import FinancialWellness from './pages/FinancialWellness';
import Compare from './pages/Compare';
import Roadmap from './pages/Roadmap';
import FAQ from './pages/FAQ';
import Blog from './pages/FinanceBlog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import CustomerCare from './pages/CustomerCare';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiePolicy from './pages/CookiePolicy';
import Disclaimer from './pages/Disclaimer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && isFetched && !profileLoading && userProfile === null && !isSubmitting) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile, isSubmitting]);

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !userId.trim()) {
      return;
    }

    setIsSubmitting(true);

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      id: userId.trim(),
      createdAt: BigInt(Date.now() * 1000000),
    };

    saveProfile.mutate(profile, {
      onSuccess: () => {
        setTimeout(() => {
          setShowProfileSetup(false);
          setName('');
          setEmail('');
          setUserId('');
          setIsSubmitting(false);
        }, 300);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  if (isInitializing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary/30 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 h-20 w-20 animate-pulse rounded-full bg-primary/20 mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-foreground">Loading FinanceWise AI</p>
            <p className="text-sm text-muted-foreground">Preparing your financial dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <Toaster position="top-right" />

      <Dialog open={showProfileSetup} onOpenChange={() => {}}>
        <DialogContent 
          className="sm:max-w-md transition-all duration-300 ease-in-out border-2 border-primary/20" 
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Welcome to FinanceWise AI!
            </DialogTitle>
            <DialogDescription className="text-base">
              Let's set up your profile to personalize your financial journey.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileSetup} className="space-y-6 mt-4">
            <div className="space-y-3">
              <Label htmlFor="setup-name" className="text-base font-semibold">
                Full Name *
              </Label>
              <Input
                id="setup-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-12 text-base transition-all duration-200"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="setup-id" className="text-base font-semibold">
                ID *
              </Label>
              <Input
                id="setup-id"
                type="text"
                placeholder="Enter your ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-12 text-base transition-all duration-200"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="setup-email" className="text-base font-semibold">
                Email Address *
              </Label>
              <Input
                id="setup-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-12 text-base transition-all duration-200"
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary/10 to-chart-1/10 border border-primary/20 rounded-lg transition-all duration-200">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is encrypted and secure. We never share your information with third parties.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim() || !email.trim() || !userId.trim()} 
              size="lg" 
              className="w-full transition-all duration-200 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2"></div>
                  Setting up...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

// Public Routes (No Authentication Required)
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const howItWorksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/how-it-works',
  component: HowItWorks,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: Features,
});

const benefitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/benefits',
  component: Benefits,
});

const securityPublicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/security-privacy',
  component: SecurityPublic,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resources',
  component: Resources,
});

const useCasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/use-cases',
  component: UseCases,
});

const aiExplainedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-explained',
  component: AIExplained,
});

const financialWellnessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/financial-wellness',
  component: FinancialWellness,
});

const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compare',
  component: Compare,
});

const roadmapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/roadmap',
  component: Roadmap,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FAQ,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: Blog,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$slug',
  component: BlogPost,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
});

const customerCareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support',
  component: CustomerCare,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicy,
});

const termsAndConditionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms-and-conditions',
  component: TermsAndConditions,
});

const cookiePolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cookie-policy',
  component: CookiePolicy,
});

const disclaimerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/disclaimer',
  component: Disclaimer,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: Login,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

// Private Routes (Authentication Required) - Wrapped with AppLayout
const privateLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'private',
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/dashboard',
  component: Dashboard,
});

const transactionsRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/transactions',
  component: Transactions,
});

const aiInsightsRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/ai-insights',
  component: AIInsights,
});

const goalsRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/goals',
  component: Goals,
});

const analyticsRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/analytics',
  component: Analytics,
});

const calculatorsRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/calculators',
  component: Calculators,
});

const moneyPsychologyRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/money-psychology',
  component: MoneyPsychology,
});

const learningRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/learning',
  component: Learning,
});

const quizRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/quiz',
  component: Quiz,
});

const challengesRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/challenges',
  component: Challenges,
});

const budgetPlannerRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/budget-planner',
  component: BudgetPlanner,
});

const settingsRoute = createRoute({
  getParentRoute: () => privateLayoutRoute,
  path: '/settings',
  component: Settings,
});

const routeTree = rootRoute.addChildren([
  // Public routes
  homeRoute,
  howItWorksRoute,
  featuresRoute,
  benefitsRoute,
  securityPublicRoute,
  aboutRoute,
  resourcesRoute,
  useCasesRoute,
  aiExplainedRoute,
  financialWellnessRoute,
  compareRoute,
  roadmapRoute,
  faqRoute,
  blogRoute,
  blogPostRoute,
  contactRoute,
  customerCareRoute,
  privacyPolicyRoute,
  termsAndConditionsRoute,
  cookiePolicyRoute,
  disclaimerRoute,
  signUpRoute,
  loginRoute,
  // Private routes (wrapped with AppLayout)
  privateLayoutRoute.addChildren([
    dashboardRoute,
    transactionsRoute,
    aiInsightsRoute,
    goalsRoute,
    analyticsRoute,
    calculatorsRoute,
    moneyPsychologyRoute,
    learningRoute,
    quizRoute,
    challengesRoute,
    budgetPlannerRoute,
    settingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
