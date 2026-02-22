import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Features', href: '/features' },
    { name: 'Security', href: '/security' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            FinanceWise AI
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate({ to: item.href })}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/login' })}
            className="hidden md:inline-flex"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate({ to: '/login' })}
            className="hidden md:inline-flex bg-gradient-to-r from-primary to-chart-1"
          >
            Sign Up
          </Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate({ to: item.href });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      navigate({ to: '/login' });
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-chart-1"
                    onClick={() => {
                      navigate({ to: '/login' });
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
