import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Receipt, 
  Lightbulb, 
  Target, 
  BarChart3, 
  Calculator, 
  Brain, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Trophy,
  Wallet
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AIChatbot from './AIChatbot';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Control Center' },
  { name: 'Transactions', href: '/transactions', icon: Receipt, description: 'Money Story' },
  { name: 'AI Insights', href: '/ai-insights', icon: Lightbulb, description: 'Personal Coach' },
  { name: 'Goals', href: '/goals', icon: Target, description: 'Dream Builder' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Financial X-Ray' },
  { name: 'Budget Planner', href: '/budget-planner', icon: Wallet, description: 'Smart Planning' },
  { name: 'Calculators', href: '/calculators', icon: Calculator, description: 'Decision Helpers' },
  { name: 'Money Psychology', href: '/money-psychology', icon: Brain, description: 'Self Awareness' },
  { name: 'Learning & Quiz', href: '/learning', icon: GraduationCap, description: 'Finance Made Simple' },
  { name: 'Challenges', href: '/challenges', icon: Trophy, description: 'Build Habits' },
  { name: 'Settings', href: '/settings', icon: Settings, description: 'Full Control' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, clear, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      queryClient.clear();
      await clear();
      toast.success('Logged out successfully');
      navigate({ to: '/' });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setTimeout(() => setIsLoggingOut(false), 500);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isLogoutDisabled = loginStatus === 'logging-in' || isLoggingOut;

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            FinanceWise AI
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16">
          <div className="flex flex-col h-full p-4 space-y-2 overflow-y-auto pb-24">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate({ to: item.href });
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-chart-1/20 text-primary border border-primary/30'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs opacity-70">{item.description}</span>
                  </div>
                </button>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={handleLogout}
                disabled={isLogoutDisabled}
              >
                <LogOut className="h-5 w-5" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:z-50 lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-violet-600 to-violet-800 border-r border-violet-700/50 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-2xl font-bold text-white">
              FinanceWise AI
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => navigate({ to: item.href })}
                          className={`group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-semibold w-full transition-all ${
                            isActive
                              ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                              : 'text-violet-100 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <div className="flex flex-col items-start">
                            <span>{item.name}</span>
                            <span className="text-xs opacity-80 font-normal">{item.description}</span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-3 py-3 text-sm font-semibold leading-6 border-t border-violet-700/50">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-white text-violet-700">
                      {userProfile ? getInitials(userProfile.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-white">
                      {userProfile?.name || 'User'}
                    </p>
                    <p className="text-xs text-violet-200 truncate">
                      {userProfile?.email || ''}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2 justify-start gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                  onClick={handleLogout}
                  disabled={isLogoutDisabled}
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="py-10 pt-20 lg:pt-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
