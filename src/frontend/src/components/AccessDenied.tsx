import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export default function AccessDenied() {
  const { login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setTimeout(() => setIsLoggingIn(false), 500);
    }
  };

  const isButtonDisabled = loginStatus === 'logging-in' || isLoggingIn;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full transition-all duration-300">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You need to be logged in to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={isButtonDisabled}
            className="w-full transition-all duration-200"
            size="lg"
          >
            {isButtonDisabled ? (
              <span className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2"></div>
                Logging in...
              </span>
            ) : (
              'Login with Internet Identity'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/' })}
            className="w-full transition-all duration-200"
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
