import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, Brain, Lock } from 'lucide-react';

export default function Login() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              FinanceWise AI
            </h1>
            <p className="text-xl text-muted-foreground">
              Your intelligent financial companion for smarter money management
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
              <Brain className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized financial advice and predictions powered by advanced AI
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Smart Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track expenses, set goals, and visualize your financial journey
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
              <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and stored securely on the blockchain
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <Card className="w-full max-w-md mx-auto border-2 border-primary/20">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in with Internet Identity to access your financial dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90"
            >
              {isLoggingIn ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Sign In with Internet Identity
                </>
              )}
            </Button>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Secure authentication via Internet Computer</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4 text-primary" />
                <span>No passwords required - use biometrics or security keys</span>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              New to FinanceWise AI? Signing in will automatically create your account.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
