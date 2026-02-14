import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { buildInfo, TARGET_VERSION, isTargetVersion } from '@/lib/buildInfo';
import { useBackendVersion } from '@/hooks/useBackendVersion';
import { AlertTriangle, CheckCircle2, Info, Server, Code, Calendar, GitBranch } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DeploymentInfo() {
  const { data: backendVersion, isLoading: backendLoading, error: backendError } = useBackendVersion();
  
  const showVersionWarning = !isTargetVersion();
  const versionsMatch = buildInfo.version === backendVersion;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Deployment Information
            </h1>
            <p className="text-lg text-muted-foreground">
              Build version details and deployment verification
            </p>
          </div>

          {/* Version Warning Alert */}
          {showVersionWarning && (
            <Alert variant="destructive" className="border-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">Version Mismatch Warning</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>
                  The configured frontend build version (<strong>{buildInfo.version}</strong>) does not match 
                  the target version (<strong>{TARGET_VERSION}</strong>).
                </p>
                <p className="text-sm">
                  This deployment may not reflect the intended version 242 rebuild. Please verify the build 
                  configuration and redeploy with VITE_APP_VERSION=242 if this is incorrect.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {!showVersionWarning && (
            <Alert className="border-2 border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-lg font-semibold text-green-500">Version Verified</AlertTitle>
              <AlertDescription className="mt-2 text-muted-foreground">
                Frontend is running the target version {TARGET_VERSION} as expected.
              </AlertDescription>
            </Alert>
          )}

          {/* Frontend Version Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Code className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <CardTitle className="text-2xl">Frontend Version</CardTitle>
                  <CardDescription>Client-side application build information</CardDescription>
                </div>
                <Badge variant={isTargetVersion() ? 'default' : 'destructive'} className="text-lg px-4 py-1">
                  v{buildInfo.version}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Build Mode</p>
                  <p className="text-lg font-semibold capitalize">{buildInfo.mode}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Environment</p>
                  <p className="text-lg font-semibold">
                    {buildInfo.isProduction ? 'Production' : 'Development'}
                  </p>
                </div>
              </div>

              {buildInfo.timestamp && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Build Timestamp</p>
                      <p className="text-base font-mono">{buildInfo.timestamp}</p>
                    </div>
                  </div>
                </>
              )}

              {buildInfo.gitSha && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <GitBranch className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Git SHA</p>
                      <p className="text-base font-mono">{buildInfo.gitSha}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Backend Version Card */}
          <Card className="border-2 border-chart-1/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Server className="h-6 w-6 text-chart-1" />
                <div className="flex-1">
                  <CardTitle className="text-2xl">Backend Version</CardTitle>
                  <CardDescription>Internet Computer canister version</CardDescription>
                </div>
                {backendLoading ? (
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                    Loading...
                  </Badge>
                ) : backendError ? (
                  <Badge variant="destructive" className="text-lg px-4 py-1">
                    Error
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-lg px-4 py-1 bg-chart-1">
                    v{backendVersion}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {backendLoading ? (
                <p className="text-muted-foreground">Fetching backend version...</p>
              ) : backendError ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to fetch backend version. Please check your connection and try again.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Version Number</p>
                    <p className="text-lg font-semibold">{backendVersion}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Version Comparison Card */}
          {!backendLoading && !backendError && backendVersion && (
            <Card className={`border-2 ${versionsMatch ? 'border-green-500/20 bg-green-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {versionsMatch ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Info className="h-6 w-6 text-amber-500" />
                  )}
                  <div>
                    <CardTitle className="text-xl">Version Comparison</CardTitle>
                    <CardDescription>Frontend vs Backend version alignment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 p-4 bg-background/50 rounded-lg border">
                    <p className="text-sm font-medium text-muted-foreground">Frontend</p>
                    <p className="text-2xl font-bold text-primary">v{buildInfo.version}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-background/50 rounded-lg border">
                    <p className="text-sm font-medium text-muted-foreground">Backend</p>
                    <p className="text-2xl font-bold text-chart-1">v{backendVersion}</p>
                  </div>
                </div>

                {versionsMatch ? (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700 dark:text-green-400">
                      Frontend and backend versions are synchronized.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-amber-500/50 bg-amber-500/10">
                    <Info className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                      Frontend version ({buildInfo.version}) differs from backend version ({backendVersion}). 
                      This may be intentional during staged deployments.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Information Note */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                About Version Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                This page displays build-time version information for both the frontend and backend components 
                of FinanceWise AI. Version numbers help verify that the correct build has been deployed.
              </p>
              <p>
                The frontend version is set at build time via the <code className="px-1.5 py-0.5 bg-muted rounded text-xs">VITE_APP_VERSION</code> environment 
                variable. The backend version is retrieved from the Internet Computer canister.
              </p>
              <p>
                For version 242 rebuild verification, both versions should display <strong>242</strong> or <strong>2.4.2</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
