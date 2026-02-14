import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useGetAllBlogPosts } from '../hooks/useQueries';

export default function FinanceBlog() {
  const { data: blogPosts, isLoading } = useGetAllBlogPosts();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-chart-1/10 to-chart-2/10">
          <div className="container mx-auto max-w-6xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Financial Education Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Finance Blog & Learning Center
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides on personal finance, saving strategies, budgeting methods, investing basics, and wealth-building techniques
            </p>
          </div>
        </section>
        
        {/* Blog Posts Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts?.map((post) => (
                  <Link
                    key={post.id}
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="group"
                  >
                    <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.publicationDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                          Read Full Article
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
            
            {/* SEO Content */}
            <div className="mt-16 prose prose-sm max-w-none">
              <Card className="border-muted">
                <CardHeader>
                  <CardTitle className="text-xl">Why Financial Education Matters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Financial literacy is the foundation of long-term wealth creation and financial security. Our comprehensive blog covers essential topics including personal finance fundamentals, smart saving strategies, practical budgeting methods, beginner-friendly investing guidance, stock market basics, mutual funds, SIP investments, and emergency fund planning.
                  </p>
                  <p>
                    Each article is designed to solve real-world financial problems with actionable advice. Whether you're learning to budget for the first time, exploring investment options, or optimizing your existing financial strategy, our content provides clear, practical guidance backed by proven principles.
                  </p>
                  <p>
                    <strong>Educational Disclaimer:</strong> All content is for educational purposes only and does not constitute personalized financial advice. Always consult qualified financial advisors before making significant financial decisions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
