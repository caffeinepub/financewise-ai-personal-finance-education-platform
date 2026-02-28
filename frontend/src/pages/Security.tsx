import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Key, Database, Eye, CheckCircle2 } from 'lucide-react';

export default function Security() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Security & Privacy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your financial data is protected with bank-level security
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Military-Grade Encryption</CardTitle>
                <CardDescription>
                  All data is encrypted using AES-256 encryption standard, the same used by banks and governments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-chart-1/20">
              <CardHeader>
                <Database className="w-12 h-12 text-chart-1 mb-4" />
                <CardTitle>Blockchain Storage</CardTitle>
                <CardDescription>
                  Your data is stored on the Internet Computer blockchain, ensuring immutability and security.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-chart-2/20">
              <CardHeader>
                <Key className="w-12 h-12 text-chart-2 mb-4" />
                <CardTitle>Internet Identity</CardTitle>
                <CardDescription>
                  Passwordless authentication using blockchain technology. No passwords to remember or steal.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-chart-3/20">
              <CardHeader>
                <Eye className="w-12 h-12 text-chart-3 mb-4" />
                <CardTitle>Zero-Knowledge Architecture</CardTitle>
                <CardDescription>
                  We cannot access your data. Only you have the keys to decrypt your financial information.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-chart-4/20">
              <CardHeader>
                <Lock className="w-12 h-12 text-chart-4 mb-4" />
                <CardTitle>No Third-Party Access</CardTitle>
                <CardDescription>
                  Your data is never shared with advertisers, data brokers, or any third parties.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-chart-5/20">
              <CardHeader>
                <CheckCircle2 className="w-12 h-12 text-chart-5 mb-4" />
                <CardTitle>GDPR Compliant</CardTitle>
                <CardDescription>
                  Full compliance with data protection regulations. You have complete control over your data.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
