import { Link } from 'wouter';
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import logoImage from '@assets/image_1761851162836.png';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <Card className="w-full max-w-2xl p-8 md:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logoImage} alt="MindElevate" className="h-16 w-16 mb-4" />
          <h1 className="text-3xl font-bold">Admin Access Is Moving</h1>
          <p className="text-muted-foreground mt-3 max-w-xl">
            This GitHub Pages build is public and static only. Content editing and admin access will be handled through Sanity Studio in the next migration step.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="rounded-xl border bg-muted/30 p-5">
            <div className="flex items-center gap-2 font-semibold mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Current status
            </div>
            <p className="text-sm text-muted-foreground">No admin login is exposed on this static deployment, so visitors cannot access unfinished CMS or payment flows.</p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-5">
            <div className="flex items-center gap-2 font-semibold mb-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Next step
            </div>
            <p className="text-sm text-muted-foreground">We will point this button to your Sanity Studio URL once the studio is created and deployed.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <a href="https://www.sanity.io/" target="_blank" rel="noopener noreferrer">Open Sanity</a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
