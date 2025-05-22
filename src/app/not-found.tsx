// src/app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Frown } from 'lucide-react';

/**
 * Custom 404 Not Found page.
 * This page is displayed when a user navigates to a route that does not exist.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-6">
      <Frown className="w-24 h-24 text-primary mb-8 animate-bounce" />
      <h1 className="text-5xl font-extrabold text-primary mb-4">
        404
      </h1>
      <h2 className="text-3xl font-semibold text-foreground mb-6">
        Oops! Page Not Found
      </h2>
      <p className="text-lg text-muted-foreground mb-10 max-w-md">
        It seems the page you're looking for has taken a little detour or doesn't exist.
        Let's get you back on track!
      </p>
      <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg px-8 py-6 text-lg font-semibold transform hover:scale-105 transition-transform">
        <Link href="/">
          <Home className="mr-2 h-5 w-5" />
          Go Back Home
        </Link>
      </Button>
    </div>
  );
}
