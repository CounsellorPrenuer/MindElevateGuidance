import { Home } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">Page not found</p>
        <h1 className="text-3xl font-bold mb-3">That route is not part of the static site.</h1>
        <p className="text-muted-foreground mb-6">Use the button below to return to the main MindElevate experience.</p>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </Button>
      </Card>
    </div>
  );
}
