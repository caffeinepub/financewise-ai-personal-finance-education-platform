import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, Shield, Eye, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground">Last updated: January 31, 2026</p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Cookie className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">What Are Cookies?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-chart-1" />
                <CardTitle className="text-xl">Types of Cookies We Use</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Essential Cookies (Required)</h3>
                <p className="mb-2">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and accessibility.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing</li>
                  <li>Cookie consent preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Analytics Cookies (Optional)</h3>
                <p className="mb-2">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Google Analytics for usage statistics</li>
                  <li>Page view tracking</li>
                  <li>User behavior analysis</li>
                  <li>Performance monitoring</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Advertising Cookies (Optional)</h3>
                <p className="mb-2">
                  These cookies are used to deliver relevant advertisements and track ad campaign performance.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Google AdSense (Publisher ID: ca-pub-5050836253831761)</li>
                  <li>Personalized ad delivery</li>
                  <li>Ad performance tracking</li>
                  <li>Frequency capping</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Functional Cookies (Optional)</h3>
                <p className="mb-2">
                  These cookies enable enhanced functionality and personalization.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Theme preferences (dark/light mode)</li>
                  <li>Language settings</li>
                  <li>Currency preferences</li>
                  <li>UI customization</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-chart-2" />
                <CardTitle className="text-xl">Third-Party Cookies</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use the following third-party services that may set cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Google Analytics:</strong> To understand user behavior and improve our service</li>
                <li><strong>Google AdSense:</strong> To display relevant advertisements</li>
                <li><strong>Internet Computer:</strong> For blockchain-based authentication and storage</li>
              </ul>
              <p className="mt-4">
                These third parties have their own privacy policies and cookie policies. We recommend reviewing them to understand how they use cookies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-chart-3" />
                <CardTitle className="text-xl">Managing Your Cookie Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                You have several options to manage cookies:
              </p>
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Cookie Consent Banner</h3>
                <p>
                  When you first visit our website, you'll see a cookie consent banner where you can accept all cookies, reject optional cookies, or manage your preferences.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Browser Settings</h3>
                <p>
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies</li>
                  <li>Delete cookies after each session</li>
                  <li>Set exceptions for specific websites</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Opt-Out Tools</h3>
                <p>
                  You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-chart-4" />
                <CardTitle className="text-xl">Impact of Disabling Cookies</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you disable cookies, some features of FinanceWise AI may not function properly:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You may need to log in more frequently</li>
                <li>Your preferences may not be saved</li>
                <li>Some features may not work as expected</li>
                <li>You may see less relevant advertisements</li>
              </ul>
              <p className="mt-4">
                Essential cookies cannot be disabled as they are necessary for the website to function.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Cookie Duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Cookies may be either "session" cookies or "persistent" cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until you delete them</li>
              </ul>
              <p className="mt-4">
                Our cookie consent preferences are stored for 365 days.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any significant changes by posting the new policy on this page.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardHeader>
              <CardTitle className="text-xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about our use of cookies, please contact us:
              </p>
              <p className="font-semibold text-foreground">
                Email: fwiseai@gmail.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
