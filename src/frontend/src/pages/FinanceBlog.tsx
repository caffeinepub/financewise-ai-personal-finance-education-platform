import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Lightbulb } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { staticProblemSolutionBlogs } from '../content/staticProblemSolutionBlogs';

export default function FinanceBlog() {
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
                Learn about personal finance through real problems and practical solutions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staticProblemSolutionBlogs.map((blog) => (
                <Card key={blog.id} className="border-2 border-border/50 hover:border-primary/40 transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2 flex items-start gap-2">
                      <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span>{blog.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                          <span className="w-2 h-2 rounded-full bg-destructive"></span>
                          Problem:
                        </div>
                        <CardDescription className="text-sm pl-4">
                          {blog.problem}
                        </CardDescription>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                          <Lightbulb className="w-4 h-4" />
                          Solution:
                        </div>
                        <CardDescription className="text-sm pl-6">
                          {blog.solution}
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-lg border-2 border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Educational Purpose Only:</strong> These blogs provide general financial education and are not personalized financial advice. 
                Always consult with a qualified financial advisor for decisions specific to your situation.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
