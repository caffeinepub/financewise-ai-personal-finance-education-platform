import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

interface ProfileSetupProps {
  onSave: (profile: { name: string; email: string; id: string }) => Promise<void>;
  isSaving: boolean;
}

export default function ProfileSetup({ onSave, isSaving }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !userId.trim()) return;
    await onSave({ name: name.trim(), email: email.trim(), id: userId.trim() });
  };

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md border-2 border-primary/20"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Welcome to FinanceWise AI!
          </DialogTitle>
          <DialogDescription className="text-base">
            Let's set up your profile to personalize your financial journey.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="ps-name">Full Name *</Label>
            <Input
              id="ps-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSaving}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ps-id">ID *</Label>
            <Input
              id="ps-id"
              type="text"
              placeholder="Enter your ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={isSaving}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ps-email">Email Address *</Label>
            <Input
              id="ps-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSaving}
              className="h-11"
            />
          </div>
          <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Your data is encrypted and secure. We never share your information with third parties.
            </p>
          </div>
          <Button
            type="submit"
            disabled={isSaving || !name.trim() || !email.trim() || !userId.trim()}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-chart-1"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                Setting up...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
