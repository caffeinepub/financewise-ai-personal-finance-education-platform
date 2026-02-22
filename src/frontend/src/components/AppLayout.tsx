import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate, Outlet, useLocation } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, LayoutDashboard, TrendingUp, Target, BarChart3, Calculator, Brain, BookOpen, Settings, LogOut, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useGetCallerUserProfile, useGetCallerUserPreferences } from '../hooks/useQueries';
import AccessDenied from './AccessDenied';
import AIChatbot from './AIChatbot';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import AIInsights from '../pages/AIInsights';
import Goals from '../pages/Goals';
import Analytics from '../pages/Analytics';
import Calculators from '../pages/Calculators';
import MoneyPsychology from '../pages/MoneyPsychology';
import Learning from '../pages/Learning';
import Quiz from '../pages/Quiz';
import SettingsPage from '../pages/Settings';
import BudgetPlanner from '../pages/BudgetPlanner';
import AnalyticsGuard from './AnalyticsGuard';

export default function AppLayout() {
  const { identity, clear } = useInternetIdentity();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: preferences } = useGetCallerUserPreferences();

  // Filter navigation based on analyticsVisible preference
  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: TrendingUp },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Budget Planner', href: '/budget-planner', icon: DollarSign },
    { name: 'Calculators', href: '/calculators', icon: Calculator },
    { name: 'AI Insights', href: '/ai-insights', icon: Brain },
    { name: 'Quiz', href: '/quiz', icon: BookOpen },
  ];

  const analyticsItem = { name: 'Analytics', href: '/analytics', icon: BarChart3 };

  const navigation = preferences?.analyticsVisible !== false 
    ? [...baseNavigation.slice(0, 3), analyticsItem, ...baseNavigation.slice(3)]
    : baseNavigation;

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    // Clear React Query cache (this clears all frontend state)
    queryClient.clear();
    
    // Clear Internet Identity (this clears authentication state)
    await clear();
    
    // Note: Backend data is preserved - no delete operations are triggered
    console.log('Logout complete - frontend state cleared, backend data preserved');
    
    // Navigate to home
    navigate({ to: '/' });
  };

  if (!isAuthenticated) {
    return <AccessDenied />;
  }

  // Render the appropriate page based on current path
  const renderPage = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') return <Dashboard />;
    if (path === '/transactions') return <Transactions />;
    if (path === '/ai-insights') return <AIInsights />;
    if (path === '/goals') return <Goals />;
    if (path === '/analytics') return <AnalyticsGuard><Analytics /></AnalyticsGuard>;
    if (path === '/calculators') return <Calculators />;
    if (path === '/money-psychology') return <MoneyPsychology />;
    if (path === '/learning') return <Learning />;
    if (path === '/quiz') return <Quiz />;
    if (path === '/settings') return <SettingsPage />;
    if (path === '/budget-planner') return <BudgetPlanner />;
    
    return <Dashboard />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-full flex-col">
                  <div className="border-b p-6">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                      FinanceWise AI
                    </h2>
                  </div>
                  <nav className="flex-1 space-y-1 p-4">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      return (
                        <Button
                          key={item.name}
                          variant={isActive ? 'secondary' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => {
                            navigate({ to: item.href });
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {item.name}
                        </Button>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              FinanceWise AI
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-chart-1 text-primary-foreground">
                      {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userProfile?.email || ''}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/settings' })}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => navigate({ to: item.href })}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <main className="md:pl-64">
        <div className="container py-6 px-4">
          {renderPage()}
        </div>
      </main>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
