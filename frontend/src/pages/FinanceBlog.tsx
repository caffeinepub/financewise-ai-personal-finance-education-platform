import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSEO } from '../hooks/useSEO';
import { staticBlogArticles } from '../content/staticBlogArticles';
import { Calendar, Clock, Tag, ArrowRight, BookOpen } from 'lucide-react';

const AdSensePlaceholder: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`adsense-container ${className}`}>
    {/* AdSense Ad Unit: Replace with your ad code */}
    <div className="w-full min-h-[90px] bg-muted/30 border border-border/50 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
      <span className="opacity-50">Advertisement</span>
    </div>
  </div>
);

const CATEGORIES = ['All', ...Array.from(new Set(staticBlogArticles.map((a) => a.category)))];

export default function FinanceBlog() {
  useSEO(
    'Personal Finance Blog – FinanceWise AI',
    'Read expert finance articles on budgeting, saving, investing, and money management from the FinanceWise AI blog.'
  );

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered =
    selectedCategory === 'All'
      ? staticBlogArticles
      : staticBlogArticles.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Personal Finance Blog
          </div>
          <h1 className="text-4xl font-bold mb-4">Financial Education &amp; Insights</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Welcome to the FinanceWise AI blog — your trusted resource for practical personal
            finance education. Our articles cover budgeting, saving, investing, expense
            management, and the role of artificial intelligence in modern money management.
            Whether you are just starting your financial journey or looking to optimize an
            already solid foundation, you will find actionable, evidence-based guidance here.
            Each article is written to be accessible to beginners while providing enough depth
            to be valuable for experienced savers and investors. Explore our growing library
            of finance articles and take the next step toward financial freedom.
          </p>
        </div>
      </section>

      {/* AdSense Placeholder - After intro, before article grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AdSensePlaceholder />
      </div>

      {/* Category Filter */}
      <section className="py-4 px-4 border-b border-border">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <article
                key={article.slug}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/assets/generated/blog-personal-finance.dim_800x600.jpg';
                    }}
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg mb-2 leading-snug line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: article.slug }}
                    className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline mt-auto"
                  >
                    Read Article <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No articles found in this category.
            </div>
          )}
        </div>
      </section>

      {/* Educational Disclaimer */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto bg-muted/30 border border-border rounded-xl p-6 text-sm text-muted-foreground text-center">
          <strong>Educational Disclaimer:</strong> All articles on this blog are for educational
          purposes only and do not constitute financial, investment, tax, or legal advice. Please
          consult a qualified financial advisor before making any financial decisions.
        </div>
      </section>

      <Footer />
    </div>
  );
}
