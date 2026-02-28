import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck, FileText, Globe, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SecurityPrivacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Security & Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Your data security and privacy are our top priorities. Learn how we protect your financial information.
            </p>
          </div>

          {/* Data Collection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                <CardTitle>Data Collection Practices</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We collect only the information necessary to provide you with our financial management services:
              </p>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li><strong>Personal Information:</strong> Name, email address, and user ID for account creation</li>
                <li><strong>Financial Data:</strong> Income, expenses, budgets, savings goals, and transaction records</li>
                <li><strong>Usage Data:</strong> App interactions, preferences, and feature usage for service improvement</li>
                <li><strong>Device Information:</strong> Browser type, operating system, and IP address for security purposes</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We do not collect sensitive information such as bank account numbers, credit card details, or social security numbers.
              </p>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
                <CardTitle>How We Use Your Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your data is used exclusively to provide and improve our services:
              </p>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li><strong>Service Delivery:</strong> Process transactions, generate budgets, and provide AI-powered insights</li>
                <li><strong>Personalization:</strong> Customize your experience based on your financial goals and preferences</li>
                <li><strong>Analytics:</strong> Analyze spending patterns and generate predictions to help you make better financial decisions</li>
                <li><strong>Communication:</strong> Send important updates, notifications, and educational content</li>
                <li><strong>Security:</strong> Detect and prevent fraudulent activities and unauthorized access</li>
              </ul>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold text-primary">We never sell your data to third parties</p>
              </div>
            </CardContent>
          </Card>

          {/* Storage Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                <CardTitle>Storage & Security Measures</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement industry-leading security measures to protect your data:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Blockchain Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is stored on the Internet Computer blockchain, providing immutable and tamper-proof storage
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    All data is encrypted in transit and at rest using AES-256 encryption standards
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Zero-Knowledge Architecture</h3>
                  <p className="text-sm text-muted-foreground">
                    We cannot access your unencrypted data - only you have the keys to your information
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Regular Security Audits</h3>
                  <p className="text-sm text-muted-foreground">
                    Our systems undergo regular security assessments and penetration testing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-primary" />
                <CardTitle>Your Rights & Control</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You have complete control over your data:
              </p>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li><strong>Access:</strong> View all data we have collected about you at any time</li>
                <li><strong>Correction:</strong> Update or correct your personal information through your account settings</li>
                <li><strong>Deletion:</strong> Request complete deletion of your account and all associated data</li>
                <li><strong>Export:</strong> Download your data in a portable format for your records</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications while maintaining your account</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                To exercise any of these rights, contact us at <a href="mailto:fwiseai@gmail.com" className="text-primary hover:underline">fwiseai@gmail.com</a>
              </p>
            </CardContent>
          </Card>

          {/* Internet Identity */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle>Internet Identity Authentication</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use Internet Identity for secure, passwordless authentication:
              </p>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li><strong>No Passwords:</strong> Eliminates the risk of password breaches and phishing attacks</li>
                <li><strong>Biometric Security:</strong> Uses your device's built-in security (fingerprint, Face ID, etc.)</li>
                <li><strong>Privacy-First:</strong> Your identity is cryptographically secured and never shared</li>
                <li><strong>Multi-Device:</strong> Securely access your account from multiple devices</li>
              </ul>
            </CardContent>
          </Card>

          {/* GDPR Compliance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-primary" />
                <CardTitle>GDPR & Regulatory Compliance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We comply with international data protection regulations:
              </p>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li><strong>GDPR Compliance:</strong> Full compliance with EU General Data Protection Regulation</li>
                <li><strong>Data Minimization:</strong> We collect only what's necessary for service delivery</li>
                <li><strong>Lawful Processing:</strong> All data processing is based on your explicit consent</li>
                <li><strong>Data Protection Officer:</strong> Dedicated team member overseeing compliance</li>
                <li><strong>Breach Notification:</strong> Immediate notification in case of any security incidents</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <CardTitle>Contact Us</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                For any questions, concerns, or requests regarding your data:
              </p>
              <div className="p-4 rounded-lg border bg-card">
                <p className="font-semibold mb-2">Data Protection Team</p>
                <p className="text-sm text-muted-foreground">Email: <a href="mailto:fwiseai@gmail.com" className="text-primary hover:underline">fwiseai@gmail.com</a></p>
                <p className="text-sm text-muted-foreground mt-2">
                  We aim to respond to all inquiries within 48 hours
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-2">This policy may be updated periodically. We will notify you of any significant changes.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
