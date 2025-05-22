
// src/app/(auth)/signin/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

/**
 * Placeholder page for sign-in.
 * Authentication has been removed from this application.
 */
export default function SignInPageRemoved() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Sign In
          </h1>
          <p className="mt-2 text-muted-foreground">
            Authentication has been removed from this application.
          </p>
        </div>
        <Alert variant="default" className="bg-muted/50">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary">Information</AlertTitle>
          <AlertDescription>
            The user sign-in feature is currently not available in this version of TutorVerse.
            You can continue to use the app's features without signing in.
          </AlertDescription>
        </Alert>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/">Go back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

    