import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeftRight,
  BarChart3,
  Brain,
  Calculator,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { path: "/goals", label: "Goals", icon: Target },
  { path: "/budget-planner", label: "Budget Planner", icon: Calculator },
  { path: "/net-worth", label: "Net Worth", icon: TrendingUp },
  { path: "/emergency-fund", label: "Emergency Fund", icon: Shield },
  { path: "/spending-limits", label: "Spending Limits", icon: AlertCircle },
  { path: "/calculators", label: "Calculators", icon: Calculator },
  { path: "/ai-insights", label: "AI Insights", icon: Brain },
  { path: "/quiz", label: "Quiz", icon: HelpCircle },
  { path: "/settings", label: "Settings", icon: Settings },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath = location.pathname;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 flex-1">
      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = currentPath === path;
        return (
          <button
            type="button"
            key={path}
            onClick={() => {
              navigate({ to: path });
              onNavigate?.();
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left w-full ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card/50 p-3 shrink-0">
        <div className="mb-4 px-2">
          <h2 className="text-base font-bold text-foreground">
            FinanceWise AI
          </h2>
          <p className="text-xs text-muted-foreground">Smart Finance</p>
        </div>
        <NavLinks />
        <div className="mt-auto pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header + Sheet */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 shrink-0">
          <h2 className="text-sm font-bold text-foreground">FinanceWise AI</h2>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4 flex flex-col">
              <div className="mb-4">
                <h2 className="text-base font-bold text-foreground">
                  FinanceWise AI
                </h2>
                <p className="text-xs text-muted-foreground">Smart Finance</p>
              </div>
              <NavLinks onNavigate={() => setMobileOpen(false)} />
              <div className="mt-auto pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-muted-foreground"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
