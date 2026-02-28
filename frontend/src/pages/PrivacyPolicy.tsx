import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, Database, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last updated: January 31, 2026</p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Your Privacy Matters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                At FinanceWise AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you use our platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-chart-1" />
                <CardTitle className="text-xl">Information We Collect</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Personal Information:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name and email address (provided during profile setup)</li>
                  <li>Internet Identity principal (for authentication)</li>
                  <li>User preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Financial Data:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Transaction records you manually enter</li>
                  <li>Savings goals and financial targets</li>
                  <li>Investment portfolio information</li>
                  <li>Loan and EMI details</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Usage Data:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Quiz progress and learning achievements</li>
                  <li>AI chat conversations</li>
                  <li>Feature usage patterns</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-chart-2" />
                <CardTitle className="text-xl">How We Use Your Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide personalized financial insights and recommendations</li>
                <li>Generate AI-powered predictions and analysis</li>
                <li>Track your financial goals and progress</li>
                <li>Improve our services and user experience</li>
                <li>Send important updates and notifications (if enabled)</li>
                <li>Respond to your support requests</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="w-8 h-8 text-chart-3" />
                <CardTitle className="text-xl">Data Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Military-grade encryption for all data at rest and in transit</li>
                <li>Blockchain-based storage on the Internet Computer</li>
                <li>Internet Identity for secure, password-free authentication</li>
                <li>Regular security audits and updates</li>
                <li>No third-party access to your financial data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-chart-4" />
                <CardTitle className="text-xl">Your Rights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data at any time</li>
                <li>Update or correct your information</li>
                <li>Export your data in standard formats</li>
                <li>Delete your account and all associated data</li>
                <li>Opt-out of non-essential communications</li>
                <li>Request information about how your data is used</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Google AdSense:</strong> For displaying advertisements (AdSense ID: ca-pub-5050836253831761)</li>
                <li><strong>Google Analytics:</strong> For understanding user behavior (only with your consent)</li>
                <li><strong>Internet Computer:</strong> For blockchain-based data storage and authentication</li>
              </ul>
              <p className="mt-4">
                These services have their own privacy policies. We do not share your financial data with any third parties.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use cookies and similar technologies to enhance your experience. You can manage your cookie preferences through our Cookie Consent banner or in your browser settings. See our <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a> for more details.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                FinanceWise AI is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-primary" />
                <CardTitle className="text-xl">Contact Us</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
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
