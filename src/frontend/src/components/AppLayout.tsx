import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate, Outlet, useLocation } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, LayoutDashboard, TrendingUp, Target, BarChart3, Calculator, Brain, BookOpen, Settings, LogOut, DollarSign, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useGetCallerUserPreferences } from '../hooks/useQueries';
import AccessDenied from './AccessDenied';
import AIChatbot from './AIChatbot';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import AIInsights from '../pages/AIInsights';
import AIInsightsHub from '../pages/AIInsightsHub';
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

  // Clear all principal-scoped data on identity change
  useEffect(() => {
    const principal = identity?.getPrincipal().toString();
    if (!principal) {
      // Clear all queries when logged out
      queryClient.clear();
    }
  }, [identity, queryClient]);

  // Filter navigation based on analyticsVisible preference
  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: TrendingUp },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Budget Planner', href: '/budget-planner', icon: DollarSign },
    { name: 'Calculators', href: '/calculators', icon: Calculator },
    { name: 'AI Insights', href: '/ai-insights', icon: Brain },
    { name: 'AI Insights Hub', href: '/ai-insights-hub', icon: MessageSquare },
    { name: 'Quiz', href: '/quiz', icon: BookOpen },
  ];

  const analyticsItem = { name: 'Analytics', href: '/analytics', icon: BarChart3 };

  const navigation = preferences?.analyticsVisible !== false 
    ? [...baseNavigation.slice(0, 3), analyticsItem, ...baseNavigation.slice(3)]
    : baseNavigation;

  if (!identity) {
    return <AccessDenied />;
  }

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    
    // Clear all principal-scoped localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('transactions_') || key.includes('savingsGoals_') || key.includes('userPreferences_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    navigate({ to: '/' });
  };

  const handleNavigation = (href: string) => {
    navigate({ to: href });
    setIsMobileMenuOpen(false);
  };

  const userInitials = userProfile?.name
    ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // Render the appropriate page component based on current route
  const renderPageContent = () => {
    const pathname = location.pathname;
    
    if (pathname === '/dashboard') return <Dashboard />;
    if (pathname === '/transactions') return <Transactions />;
    if (pathname === '/ai-insights') return <AIInsights />;
    if (pathname === '/ai-insights-hub') return <AIInsightsHub />;
    if (pathname === '/goals') return <Goals />;
    if (pathname === '/analytics') return <AnalyticsGuard><Analytics /></AnalyticsGuard>;
    if (pathname === '/calculators') return <Calculators />;
    if (pathname === '/money-psychology') return <MoneyPsychology />;
    if (pathname === '/learning') return <Learning />;
    if (pathname === '/quiz') return <Quiz />;
    if (pathname === '/settings') return <SettingsPage />;
    if (pathname === '/budget-planner') return <BudgetPlanner />;
    
    return <Dashboard />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 px-6 border-b border-border/40">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              FinanceWise AI
            </h1>
          </div>
          
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              );
            })}
          </nav>

          <div className="flex-shrink-0 border-t border-border/40 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-chart-1 text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">{userProfile?.name || 'User'}</span>
                    <span className="text-xs text-muted-foreground truncate">{userProfile?.email || ''}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
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
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center h-16 px-6 border-b border-border/40">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                  FinanceWise AI
                </h1>
              </div>
              
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Button>
                  );
                })}
              </nav>

              <div className="flex-shrink-0 border-t border-border/40 p-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigation('/settings')}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex items-center justify-between">
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
            FinanceWise AI
          </h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-chart-1 text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userProfile?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{userProfile?.email || ''}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
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

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {renderPageContent()}
        </div>
      </main>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
