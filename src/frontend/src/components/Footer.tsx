import { useNavigate } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from 'react-icons/si';
import BuildVersionBadge from './BuildVersionBadge';

export default function Footer() {
  const navigate = useNavigate();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Features', href: '/features' },
    { name: 'Benefits', href: '/benefits' },
    { name: 'About Us', href: '/about' },
  ];

  const resources = [
    { name: 'Resources', href: '/resources' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
    { name: 'Customer Care', href: '/support' },
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'Compare', href: '/compare' },
  ];

  const trustSecurity = [
    { name: 'Security & Privacy', href: '/security-privacy' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms-and-conditions' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ];

  const learning = [
    { name: 'Financial Wellness', href: '/financial-wellness' },
    { name: 'AI Explained', href: '/ai-explained' },
    { name: 'Use Cases', href: '/use-cases' },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-4">
              FinanceWise AI
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Master your finances with AI-powered insights and intelligent financial management.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <SiFacebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <SiX className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <SiLinkedin className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <SiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate({ to: link.href })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate({ to: link.href })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Learning</h4>
            <ul className="space-y-2">
              {learning.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate({ to: link.href })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Security */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Trust & Security</h4>
            <ul className="space-y-2">
              {trustSecurity.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate({ to: link.href })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate({ to: '/deployment-info' })}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Deployment Info
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} FinanceWise AI. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <BuildVersionBadge />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
