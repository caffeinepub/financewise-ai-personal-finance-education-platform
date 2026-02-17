import { useGetCallerUserPreferences } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface AnalyticsGuardProps {
  children: React.ReactNode;
}

export default function AnalyticsGuard({ children }: AnalyticsGuardProps) {
  const { data: preferences, isLoading } = useGetCallerUserPreferences();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && preferences?.analyticsVisible === false) {
      // Don't auto-redirect, just show the message
    }
  }, [preferences, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (preferences?.analyticsVisible === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <CardTitle>Analytics Disabled</CardTitle>
            </div>
            <CardDescription>
              You have disabled analytics in your display preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To access the Analytics page, please enable "Show Analytics" in your Settings.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate({ to: '/settings' })} className="flex-1">
                Go to Settings
              </Button>
              <Button onClick={() => navigate({ to: '/dashboard' })} variant="outline" className="flex-1">
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
