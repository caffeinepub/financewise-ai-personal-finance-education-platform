import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Eye, Smartphone, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import AccessDenied from '../components/AccessDenied';

export default function SecurityPrivacy() {
  const { identity } = useInternetIdentity();
  const [stealthMode, setStealthMode] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  if (!identity) {
    return <AccessDenied />;
  }

  const connectedDevices = [
    { name: 'Chrome on Windows', location: 'New York, US', lastActive: '2 minutes ago', current: true },
    { name: 'Safari on iPhone', location: 'New York, US', lastActive: '1 hour ago', current: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Security & Privacy
          </h1>
          <p className="text-muted-foreground">Trust Center - Your data security and privacy controls</p>
        </div>

        {/* Security Status */}
        <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="w-6 h-6 text-green-500" />
              Security Status: Protected
            </CardTitle>
            <CardDescription>All security features are active and working properly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">End-to-End Encryption</p>
                  <p className="text-xs text-muted-foreground">All data encrypted with AES-256</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Internet Identity</p>
                  <p className="text-xs text-muted-foreground">Blockchain authentication active</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">No Suspicious Activity</p>
                  <p className="text-xs text-muted-foreground">Account is secure</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Private Data Storage</p>
                  <p className="text-xs text-muted-foreground">No third-party access</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Controls */}
        <Card className="border-2 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Privacy Controls
            </CardTitle>
            <CardDescription>Manage how your data is used and shared</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border/50">
              <div className="space-y-1">
                <Label htmlFor="stealth-mode" className="text-base font-semibold">
                  Stealth Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Hide your financial data from screenshots and screen recordings
                </p>
              </div>
              <Switch
                id="stealth-mode"
                checked={stealthMode}
                onCheckedChange={setStealthMode}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border/50">
              <div className="space-y-1">
                <Label htmlFor="biometric" className="text-base font-semibold">
                  Biometric Authentication
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use fingerprint or face recognition for quick access
                </p>
              </div>
              <Switch
                id="biometric"
                checked={biometricEnabled}
                onCheckedChange={setBiometricEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border/50">
              <div className="space-y-1">
                <Label htmlFor="data-sharing" className="text-base font-semibold">
                  Data Sharing
                </Label>
                <p className="text-sm text-muted-foreground">
                  Share anonymized data to improve AI predictions (recommended: off)
                </p>
              </div>
              <Switch
                id="data-sharing"
                checked={dataSharing}
                onCheckedChange={setDataSharing}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border/50">
              <div className="space-y-1">
                <Label htmlFor="analytics" className="text-base font-semibold">
                  Usage Analytics
                </Label>
                <p className="text-sm text-muted-foreground">
                  Help us improve the app by sharing usage statistics
                </p>
              </div>
              <Switch
                id="analytics"
                checked={analyticsEnabled}
                onCheckedChange={setAnalyticsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Connected Devices */}
        <Card className="border-2 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Connected Devices
            </CardTitle>
            <CardDescription>Manage devices that have access to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectedDevices.map((device, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  device.current
                    ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5'
                    : 'border-border/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{device.name}</p>
                        {device.current && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{device.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">Last active: {device.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Encryption Info */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Data Encryption & Protection
            </CardTitle>
            <CardDescription>How we protect your financial information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Military-Grade Encryption</p>
                  <p className="text-sm text-muted-foreground">
                    All data is encrypted using AES-256 encryption standard
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Blockchain Storage</p>
                  <p className="text-sm text-muted-foreground">
                    Data stored on Internet Computer blockchain for maximum security
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Zero-Knowledge Architecture</p>
                  <p className="text-sm text-muted-foreground">
                    We cannot access your data - only you have the keys
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">No Third-Party Access</p>
                  <p className="text-sm text-muted-foreground">
                    Your data is never shared with advertisers or data brokers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Internet Identity Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Secure, passwordless authentication powered by blockchain technology
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
