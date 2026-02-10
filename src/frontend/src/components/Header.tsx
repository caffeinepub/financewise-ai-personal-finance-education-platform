import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState } from 'react';
import CookieConsent from './CookieConsent';

const publicNavigation = [
  { name: 'Home', href: '/' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Features', href: '/features' },
  { name: 'Benefits', href: '/benefits' },
  { name: 'Security & Privacy', href: '/security-privacy' },
  { name: 'About Us', href: '/about' },
  { name: 'Use Cases', href: '/use-cases' },
  { name: 'AI Explained', href: '/ai-explained' },
  { name: 'Financial Wellness', href: '/financial-wellness' },
  { name: 'Compare', href: '/compare' },
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleNavigation = (href: string) => {
    navigate({ to: href });
    setIsOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => handleNavigation('/')}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                FinanceWise AI
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {publicNavigation.slice(0, 6).map((item) => (
                <Button
                  key={item.name}
                  variant={location.pathname === item.href ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavigation(item.href)}
                  className={location.pathname === item.href ? 'bg-gradient-to-r from-primary to-chart-1' : ''}
                >
                  {item.name}
                </Button>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <Button
                  onClick={() => handleNavigation('/dashboard')}
                  className="bg-gradient-to-r from-primary to-chart-1"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/signup')}
                    className="bg-gradient-to-r from-primary to-chart-1"
                  >
                    Sign Up Free
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                      FinanceWise AI
                    </h2>
                  </div>
                  
                  {publicNavigation.map((item) => (
                    <Button
                      key={item.name}
                      variant={location.pathname === item.href ? 'default' : 'ghost'}
                      className={`justify-start ${location.pathname === item.href ? 'bg-gradient-to-r from-primary to-chart-1' : ''}`}
                      onClick={() => handleNavigation(item.href)}
                    >
                      {item.name}
                    </Button>
                  ))}

                  <div className="mt-6 pt-6 border-t border-border space-y-3">
                    {isAuthenticated ? (
                      <Button
                        onClick={() => handleNavigation('/dashboard')}
                        className="w-full bg-gradient-to-r from-primary to-chart-1"
                      >
                        Dashboard
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleNavigation('/login')}
                        >
                          Login
                        </Button>
                        <Button
                          className="w-full bg-gradient-to-r from-primary to-chart-1"
                          onClick={() => handleNavigation('/signup')}
                        >
                          Sign Up Free
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Cookie Consent - only shown on public pages */}
      <CookieConsent />
    </>
  );
}
