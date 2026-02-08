import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, Shield, Scale, Ban, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground">Last updated: January 31, 2026</p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Agreement to Terms</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing and using FinanceWise AI, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our service.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-chart-1" />
                <CardTitle className="text-xl">Use of Service</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Permitted Use:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Personal financial management and tracking</li>
                  <li>Educational purposes and financial learning</li>
                  <li>Setting and tracking financial goals</li>
                  <li>Using AI insights for personal decision-making</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Requirements:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You must be at least 18 years old to use this service</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>One account per person</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Ban className="w-8 h-8 text-destructive" />
                <CardTitle className="text-xl">Prohibited Activities</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Upload malicious code or viruses</li>
                <li>Scrape or harvest data from the platform</li>
                <li>Impersonate another user or entity</li>
                <li>Share your account credentials with others</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Scale className="w-8 h-8 text-chart-2" />
                <CardTitle className="text-xl">Intellectual Property</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                All content, features, and functionality of FinanceWise AI are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You retain ownership of your financial data. By using our service, you grant us a license to process and analyze your data to provide our services.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-chart-3" />
                <CardTitle className="text-xl">Disclaimers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Educational Purpose:</h3>
                <p>
                  FinanceWise AI is provided for educational and informational purposes only. It is not intended to provide financial, investment, tax, or legal advice.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">AI-Generated Content:</h3>
                <p>
                  AI-generated insights and recommendations are based on algorithms and may not always be accurate. Always consult with qualified financial professionals before making important financial decisions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">No Guarantees:</h3>
                <p>
                  We do not guarantee specific financial outcomes or results from using our service. Past performance does not indicate future results.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-chart-4" />
                <CardTitle className="text-xl">Limitation of Liability</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                To the maximum extent permitted by law, FinanceWise AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use or inability to use the service</li>
                <li>Any unauthorized access to your data</li>
                <li>Any errors or omissions in the content</li>
                <li>Financial decisions made based on our service</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We strive to provide uninterrupted service but do not guarantee 100% uptime. We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to terminate or suspend your account immediately, without prior notice, for any violation of these Terms and Conditions.
              </p>
              <p>
                You may terminate your account at any time through the Settings page. Upon termination, your data will be permanently deleted.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last updated" date.
              </p>
              <p>
                Your continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about these Terms and Conditions, please contact us:
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
