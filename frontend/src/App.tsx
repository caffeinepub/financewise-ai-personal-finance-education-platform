import React, { useState, useEffect } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useQueries';
import AppLayout from './components/AppLayout';
import AccessDenied from './components/AccessDenied';
import ProfileSetup from './components/ProfileSetup';
import CookieConsent from './components/CookieConsent';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Features from './pages/Features';
import Benefits from './pages/Benefits';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Disclaimer from './pages/Disclaimer';
import Security from './pages/Security';
import Roadmap from './pages/Roadmap';
import Resources from './pages/Resources';
import Compare from './pages/Compare';
import UseCases from './pages/UseCases';
import FinancialWellness from './pages/FinancialWellness';
import AITransparency from './pages/AITransparency';
import SecurityPrivacy from './pages/SecurityPrivacy';
import CookiePolicy from './pages/CookiePolicy';
import FinanceBlog from './pages/FinanceBlog';
import BlogPost from './pages/BlogPost';
import MoneyPsychology from './pages/MoneyPsychology';

// Private pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import BudgetPlanner from './pages/BudgetPlanner';
import Calculators from './pages/Calculators';
import AIInsights from './pages/AIInsights';
import Quiz from './pages/Quiz';
import Settings from './pages/Settings';
import DeploymentInfo from './pages/DeploymentInfo';
import Learning from './pages/Learning';
import BlogAdmin from './pages/BlogAdmin';
import NetWorth from './pages/NetWorth';
import EmergencyFund from './pages/EmergencyFund';
import SpendingLimits from './pages/SpendingLimits';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
    mutations: { retry: 1 },
  },
});

// ─── Auth guard wrapper ───────────────────────────────────────────────────────

function PrivatePage({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  if (!identity) return <AccessDenied />;
  return <AppLayout>{children}</AppLayout>;
}

// ─── Root layout ──────────────────────────────────────────────────────────────

function RootLayout() {
  return <Outlet />;
}

const rootRoute = createRootRoute({ component: RootLayout });

// ─── Public routes ────────────────────────────────────────────────────────────

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: Login });
const signupRoute = createRoute({ getParentRoute: () => rootRoute, path: '/signup', component: Login });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: About });
const featuresRoute = createRoute({ getParentRoute: () => rootRoute, path: '/features', component: Features });
const benefitsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/benefits', component: Benefits });
const howItWorksRoute = createRoute({ getParentRoute: () => rootRoute, path: '/how-it-works', component: HowItWorks });
const faqRoute = createRoute({ getParentRoute: () => rootRoute, path: '/faq', component: FAQ });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: Contact });
const privacyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/privacy-policy', component: PrivacyPolicy });
const termsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/terms-and-conditions', component: TermsAndConditions });
const disclaimerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/disclaimer', component: Disclaimer });
const securityRoute = createRoute({ getParentRoute: () => rootRoute, path: '/security', component: Security });
const roadmapRoute = createRoute({ getParentRoute: () => rootRoute, path: '/roadmap', component: Roadmap });
const resourcesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/resources', component: Resources });
const compareRoute = createRoute({ getParentRoute: () => rootRoute, path: '/compare', component: Compare });
const useCasesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/use-cases', component: UseCases });
const financialWellnessRoute = createRoute({ getParentRoute: () => rootRoute, path: '/financial-wellness', component: FinancialWellness });
const aiTransparencyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/ai-explained', component: AITransparency });
const securityPrivacyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/security-privacy', component: SecurityPrivacy });
const cookiePolicyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/cookie-policy', component: CookiePolicy });
const financeBlogRoute = createRoute({ getParentRoute: () => rootRoute, path: '/blog', component: FinanceBlog });
const blogPostRoute = createRoute({ getParentRoute: () => rootRoute, path: '/blog/$slug', component: BlogPost });
const moneyPsychologyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/money-psychology', component: MoneyPsychology });

// ─── Private routes ───────────────────────────────────────────────────────────

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <PrivatePage><Dashboard /></PrivatePage>,
});
const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: () => <PrivatePage><Analytics /></PrivatePage>,
});
const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  component: () => <PrivatePage><Transactions /></PrivatePage>,
});
const goalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/goals',
  component: () => <PrivatePage><Goals /></PrivatePage>,
});
const budgetPlannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/budget-planner',
  component: () => <PrivatePage><BudgetPlanner /></PrivatePage>,
});
const calculatorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators',
  component: () => <PrivatePage><Calculators /></PrivatePage>,
});
const aiInsightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-insights',
  component: () => <PrivatePage><AIInsights /></PrivatePage>,
});
const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz',
  component: () => <PrivatePage><Quiz /></PrivatePage>,
});
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => <PrivatePage><Settings /></PrivatePage>,
});
const deploymentInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/deployment-info',
  component: () => <PrivatePage><DeploymentInfo /></PrivatePage>,
});
const learningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/learning',
  component: () => <PrivatePage><Learning /></PrivatePage>,
});
const blogAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog-admin',
  component: () => <PrivatePage><BlogAdmin /></PrivatePage>,
});
const netWorthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/net-worth',
  component: () => <PrivatePage><NetWorth /></PrivatePage>,
});
const emergencyFundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/emergency-fund',
  component: () => <PrivatePage><EmergencyFund /></PrivatePage>,
});
const spendingLimitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spending-limits',
  component: () => <PrivatePage><SpendingLimits /></PrivatePage>,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  signupRoute,
  aboutRoute,
  featuresRoute,
  benefitsRoute,
  howItWorksRoute,
  faqRoute,
  contactRoute,
  privacyRoute,
  termsRoute,
  disclaimerRoute,
  securityRoute,
  roadmapRoute,
  resourcesRoute,
  compareRoute,
  useCasesRoute,
  financialWellnessRoute,
  aiTransparencyRoute,
  securityPrivacyRoute,
  cookiePolicyRoute,
  financeBlogRoute,
  blogPostRoute,
  moneyPsychologyRoute,
  dashboardRoute,
  analyticsRoute,
  transactionsRoute,
  goalsRoute,
  budgetPlannerRoute,
  calculatorsRoute,
  aiInsightsRoute,
  quizRoute,
  settingsRoute,
  deploymentInfoRoute,
  learningRoute,
  blogAdminRoute,
  netWorthRoute,
  emergencyFundRoute,
  spendingLimitsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ─── Profile setup overlay ────────────────────────────────────────────────────

function ProfileSetupWrapper() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [showSetup, setShowSetup] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setShowSetup(true);
    } else if (!isAuthenticated) {
      setShowSetup(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleSaveProfile = async (profile: { name: string; email: string; id: string }) => {
    await saveProfile.mutateAsync({
      name: profile.name,
      email: profile.email,
      id: profile.id,
      createdAt: BigInt(Date.now()),
    });
    setShowSetup(false);
  };

  if (isInitializing) return null;

  return (
    <>
      {showSetup && (
        <ProfileSetup
          onSave={handleSaveProfile}
          isSaving={saveProfile.isPending}
        />
      )}
    </>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ProfileSetupWrapper />
        <CookieConsent />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
