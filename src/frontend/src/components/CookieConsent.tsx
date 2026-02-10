import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

const COOKIE_CONSENT_KEY = 'financewise_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  useEffect(() => {
    // Don't show cookie consent for authenticated users
    if (isAuthenticated) {
      setShowBanner(false);
      return;
    }

    // Check if user has already accepted cookies
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const consentData = JSON.parse(consent);
        const expiryDate = new Date(consentData.expiresAt);
        if (expiryDate < new Date()) {
          // Consent expired
          localStorage.removeItem(COOKIE_CONSENT_KEY);
          setShowBanner(true);
        }
      } catch {
        // Invalid consent data
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        setShowBanner(true);
      }
    }
  }, [isAuthenticated]);

  const handleAccept = () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);
    
    const consentData = {
      accepted: true,
      timestamp: new Date().toISOString(),
      expiresAt: expiryDate.toISOString(),
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setShowBanner(false);
  };

  // Don't render if authenticated or consent already given
  if (!showBanner || isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Cookie Notice</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. 
                By clicking "Accept", you consent to our use of cookies. Learn more in our{' '}
                <a href="/cookie-policy" className="text-primary hover:underline">
                  Cookie Policy
                </a>
                {' '}and{' '}
                <a href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleAccept}
                  className="bg-gradient-to-r from-primary to-chart-1"
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('/cookie-policy', '_blank')}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAccept}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
