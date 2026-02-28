import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FAQ() {
  const faqs = [
    {
      question: 'Is FinanceWise AI really free?',
      answer: 'Yes! All features are completely free with no hidden costs, premium tiers, or subscription fees. We believe everyone deserves access to powerful financial tools.',
    },
    {
      question: 'How secure is my financial data?',
      answer: 'Your data is protected with military-grade AES-256 encryption and stored on the Internet Computer blockchain. We use zero-knowledge architecture, meaning we cannot access your data even if we wanted to.',
    },
    {
      question: 'How accurate are the AI predictions?',
      answer: 'Our AI models provide estimates based on your historical data and patterns. While they are generally accurate, they cannot predict unexpected life events. Predictions improve as you add more data over time.',
    },
    {
      question: 'Do I need to connect my bank account?',
      answer: 'No, FinanceWise AI does not require bank account connections. You manually input your transactions, giving you complete control over what data is stored.',
    },
    {
      question: 'Can I use FinanceWise AI on mobile?',
      answer: 'Yes! The web application is fully responsive and works on all mobile devices. Native iOS and Android apps are coming soon.',
    },
    {
      question: 'What is Internet Identity?',
      answer: 'Internet Identity is a blockchain-based authentication system that eliminates passwords. It uses cryptographic keys stored on your device for secure, passwordless login.',
    },
    {
      question: 'How many quiz questions are available?',
      answer: 'We offer 100 comprehensive quiz questions covering budgeting, saving, investing, debt management, and more. New questions are added regularly.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export your financial data at any time. We believe in data portability and your right to access your information.',
    },
    {
      question: 'Is FinanceWise AI suitable for beginners?',
      answer: 'Absolutely! We designed the platform for users of all experience levels. Our educational content, quizzes, and video lessons help beginners learn while managing their finances.',
    },
    {
      question: 'How do I get support?',
      answer: 'You can reach our support team through the Contact page. We typically respond within 24 hours and are here to help with any questions or issues.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about FinanceWise AI
            </p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Common Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
