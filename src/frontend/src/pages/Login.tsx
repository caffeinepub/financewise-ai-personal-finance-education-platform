import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Shield, CheckCircle2, Lock, Eye, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const { login: iiLogin, loginStatus, isLoggingIn, identity } = useInternetIdentity();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  const handleInternetIdentityLogin = () => {
    try {
      iiLogin();
    } catch (error: any) {
      console.error('Internet Identity login error:', error);
      toast.error('Failed to connect to Internet Identity. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-chart-1/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Private & Secure</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                FinanceWise AI
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Your private personal finance manager powered by AI
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Complete Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  All your financial data is encrypted and never shared with third parties
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-chart-1/50 transition-all duration-300">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <Zap className="w-6 h-6 text-chart-1" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized financial recommendations and predictions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-chart-2/50 transition-all duration-300">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <Eye className="w-6 h-6 text-chart-2" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Complete Control</h3>
                <p className="text-sm text-muted-foreground">
                  Manage every aspect of your financial life in one secure place
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <Card className="w-full shadow-2xl border-2 border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-chart-1 to-chart-2 flex items-center justify-center mx-auto shadow-2xl relative">
              <Sparkles className="w-12 h-12 text-primary-foreground animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/50 to-chart-1/50 blur-xl"></div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base mt-3">
                Sign in to access your private financial dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Internet Identity Login Button */}
            <Button
              onClick={handleInternetIdentityLogin}
              disabled={isLoggingIn}
              size="lg"
              className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="flex items-center gap-3 relative z-10">
                <Lock className="w-6 h-6" />
                {isLoggingIn ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Sign in with Internet Identity</span>
                )}
              </div>
            </Button>

            {/* Security Features */}
            <div className="space-y-3 p-6 bg-gradient-to-br from-primary/5 to-chart-1/5 rounded-xl border border-primary/20">
              <p className="text-sm font-semibold text-foreground mb-3">Why Internet Identity?</p>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-muted-foreground">Blockchain-based authentication</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-muted-foreground">No passwords to remember or manage</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-muted-foreground">Complete privacy and data ownership</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-muted-foreground">Military-grade encryption</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/50">
              <p className="leading-relaxed">
                By signing in, you agree to keep your financial data private and secure.
                <br />
                Built with ❤️ using{' '}
                <a 
                  href="https://caffeine.ai" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline font-medium"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
