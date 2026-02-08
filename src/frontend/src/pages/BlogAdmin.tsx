import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useInitializeDefaultContent } from '@/hooks/useDefaultContentInitialization';
import { BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import AccessDenied from '@/components/AccessDenied';

export default function BlogAdmin() {
  const { identity } = useInternetIdentity();
  const initializeContent = useInitializeDefaultContent();

  if (!identity) {
    return <AccessDenied />;
  }

  const handleInitialize = async () => {
    await initializeContent.mutateAsync();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Blog Administration
          </h1>
          <p className="text-muted-foreground">Initialize and manage blog posts</p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>Content Initialization</CardTitle>
                <CardDescription>
                  Initialize 15 comprehensive finance blog posts and 100 quiz questions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {initializeContent.isSuccess ? (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-semibold text-green-500">Content initialized successfully!</p>
                  <p className="text-sm text-muted-foreground">All blog posts and quiz questions are now available.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="font-semibold text-yellow-500">Content not initialized</p>
                  <p className="text-sm text-muted-foreground">Click the button below to initialize all content.</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold">Content to be Created:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 15 comprehensive finance blog posts (1200+ words each)</li>
                <li>• 100 educational quiz questions covering all finance topics</li>
                <li>• Topics: budgeting, saving, investing, debt, loans, credit, and more</li>
              </ul>
            </div>

            <Button
              onClick={handleInitialize}
              disabled={initializeContent.isPending || initializeContent.isSuccess}
              className="w-full bg-gradient-to-r from-primary to-chart-1"
              size="lg"
            >
              {initializeContent.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2"></div>
                  Initializing Content...
                </>
              ) : initializeContent.isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Content Initialized
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Initialize All Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
