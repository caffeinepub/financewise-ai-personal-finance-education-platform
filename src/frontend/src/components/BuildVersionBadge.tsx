import { Badge } from '@/components/ui/badge';
import { buildInfo } from '@/lib/buildInfo';

export default function BuildVersionBadge() {
  return (
    <Badge 
      variant="outline" 
      className="text-xs font-mono bg-muted/50 border-border/50 hover:bg-muted transition-colors"
    >
      v{buildInfo.version}
    </Badge>
  );
}
