import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetAllBlogPreviews } from '../hooks/useQueries';
import { useInitializeDefaultContent } from '../hooks/useDefaultContentInitialization';
import { useNavigate } from '@tanstack/react-router';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FinanceBlog() {
  const { data: blogPosts = [], isLoading, refetch } = useGetAllBlogPreviews();
  const initializeContent = useInitializeDefaultContent();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && blogPosts.length === 0 && !initializeContent.isPending) {
      initializeContent.mutate();
    }
  }, [isLoading, blogPosts.length]);

  useEffect(() => {
    if (initializeContent.isSuccess) {
      setTimeout(() => {
        refetch();
      }, 500);
    }
  }, [initializeContent.isSuccess, refetch]);

  if (isLoading || initializeContent.isPending) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                {initializeContent.isPending ? 'Initializing blog posts...' : 'Loading blog posts...'}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Finance Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Learn about personal finance, investing, and money management
              </p>
            </div>

            {blogPosts.length === 0 ? (
              <Card className="border-2 border-border/50">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No blog posts available yet. Check back soon!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="border-2 border-border/50 hover:border-primary/40 transition-all">
                    <CardHeader>
                      {post.featuredImage && (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(Number(post.publicationDate) / 1000000).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate({ to: `/blog/${post.slug}` })}
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
