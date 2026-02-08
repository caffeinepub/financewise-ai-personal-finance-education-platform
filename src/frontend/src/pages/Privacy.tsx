import { Card, CardContent } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-chart-1/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: October 26, 2023</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="p-8 prose prose-invert max-w-none">
              <p className="text-lg">
                Welcome to FinanceWise AI. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
              </p>

              <h2>1. Information We Collect</h2>
              <p>
                We may collect personal information that you voluntarily provide to us, such as your name, email address, and financial data (income, expenses, goals). We also automatically collect certain information when you use our app, such as your IP address, browser type, and usage data.
              </p>

              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, to communicate with you, to personalize your experience, and to analyze usage patterns.
              </p>

              <h2>3. Sharing Your Information</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our application, conducting our business, or serving our users, as long as those parties agree to keep this information confidential.
              </p>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information. Your data is stored securely in Firebase, and we use industry-standard encryption to protect your data in transit.
              </p>

              <h2>5. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>

              <h2>6. Your Consent</h2>
              <p>
                By using our site, you consent to our web site privacy policy.
              </p>

              <h2>7. Changes to Our Privacy Policy</h2>
              <p>
                If we decide to change our privacy policy, we will post those changes on this page.
              </p>

              <h2>8. Contacting Us</h2>
              <p>
                If there are any questions regarding this privacy policy, you may contact us using the information on our Contact page.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
