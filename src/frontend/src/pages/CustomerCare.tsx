import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSubmitContactForm } from '../hooks/useQueries';
import { Mail, Clock, MessageSquare, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { ContactSubmission } from '@/types/backend-types';

export default function CustomerCare() {
  const submitForm = useSubmitContactForm();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submission: ContactSubmission = {
      id: `contact_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      message: formData.message,
      submittedAt: Date.now(),
    };

    await submitForm.mutateAsync(submission);
    
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold">Customer Care</h1>
              <p className="text-xl text-muted-foreground">
                We're here to help you succeed with FinanceWise AI
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Mail className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Email Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">fwiseai@gmail.com</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Clock className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Service Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Mon-Fri, 9 AM - 6 PM IST</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MessageSquare className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Available during business hours</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>Send us a message and we'll respond within 24-48 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitForm.isPending}
                  >
                    {submitForm.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                    <AccordionContent>
                      FinanceWise AI uses Internet Identity for authentication, which doesn't require passwords. Your identity is secured by your device's biometric authentication or security key.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is my financial data secure?</AccordionTrigger>
                    <AccordionContent>
                      Yes! All your data is encrypted and stored on the Internet Computer blockchain. We use military-grade encryption and never share your data with third parties.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>How do I export my data?</AccordionTrigger>
                    <AccordionContent>
                      You can export your transaction history and reports from the Analytics page. Click the export button to download your data in CSV format.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>Can I use FinanceWise AI on mobile?</AccordionTrigger>
                    <AccordionContent>
                      Yes! FinanceWise AI is fully responsive and works great on mobile browsers. A dedicated mobile app is coming soon.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
