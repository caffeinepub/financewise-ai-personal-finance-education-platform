import { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, Brain, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        navigate({ to: '/dashboard' });
      }
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Branding Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              FinanceWise AI
            </h1>
            <p className="text-xl text-muted-foreground">
              Your intelligent financial companion powered by blockchain security
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized financial predictions and recommendations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Blockchain Security</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and stored on the Internet Computer
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track income, expenses, and goals with intelligent analytics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in with Internet Identity to access your financial dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              size="lg"
              className="w-full"
              onClick={handleLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Login with Internet Identity
                </>
              )}
            </Button>

            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold text-sm">Secure Authentication</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  No passwords to remember
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Biometric authentication (Face ID, Touch ID)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Works with Google, Apple, Microsoft accounts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Your data stays private and encrypted
                </li>
              </ul>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By logging in, you agree to our Terms of Service and Privacy Policy.
              All your financial data is stored securely on the blockchain.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
