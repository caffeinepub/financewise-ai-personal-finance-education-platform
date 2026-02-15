import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBackendVersion } from '../hooks/useBackendVersion';
import { buildInfo, TARGET_VERSION } from '../lib/buildInfo';
import AccessDenied from '../components/AccessDenied';

export default function DeploymentInfo() {
  const { identity } = useInternetIdentity();
  const { data: backendVersion, isLoading: backendLoading, error: backendError } = useBackendVersion();

  if (!identity) {
    return <AccessDenied />;
  }

  const frontendVersion = buildInfo.version;
  const targetVersion = TARGET_VERSION;
  const versionsMatch = backendVersion ? backendVersion === frontendVersion : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Deployment Information</h1>
          <p className="text-muted-foreground">System version and build details</p>
        </div>

        {/* Version Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Version Status
            </CardTitle>
            <CardDescription>Frontend and backend version comparison</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {versionsMatch ? (
              <Alert className="bg-green-500/10 border-green-500/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Frontend and backend versions are in sync
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-amber-500/10 border-amber-500/20">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  Version mismatch detected. Consider rebuilding to sync versions.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Frontend Version</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{frontendVersion}</span>
                    <Badge variant={versionsMatch ? "default" : "secondary"}>
                      {versionsMatch ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Target: {targetVersion}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Backend Version</CardTitle>
                </CardHeader>
                <CardContent>
                  {backendLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  ) : backendError ? (
                    <div className="flex items-center gap-2 text-destructive">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">Failed to fetch</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{backendVersion}</span>
                      <Badge variant={versionsMatch ? "default" : "secondary"}>
                        {versionsMatch ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Build Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Build Metadata</CardTitle>
            <CardDescription>Detailed build information</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Environment</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {buildInfo.isProduction ? 'Production' : 'Development'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Build Time</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {buildInfo.timestamp ? new Date(buildInfo.timestamp).toLocaleString() : 'Not available'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Frontend Version</dt>
                <dd className="mt-1 text-sm font-semibold">{frontendVersion}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Backend Version</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {backendLoading ? 'Loading...' : backendError ? 'Error' : backendVersion}
                </dd>
              </div>
              {buildInfo.gitSha && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-muted-foreground">Git SHA</dt>
                  <dd className="mt-1 text-sm font-mono">{buildInfo.gitSha}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
