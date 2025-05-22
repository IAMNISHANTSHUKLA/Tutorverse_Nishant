
// src/app/(auth)/signin/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChromeIcon } from 'lucide-react'; // Using ChromeIcon as a stand-in for Google G
import { LogoIcon } from '@/components/icons/logo';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function SignInPage() {
  const { user, signInWithGoogle, isLoading: authLoading, isFirebaseConfigured } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user && !authLoading) {
      router.push('/'); // Redirect to home if already signed in
    }
  }, [user, authLoading, router]);

  const handleSignIn = async () => {
    if (!isFirebaseConfigured) return; // Prevent sign-in attempt if not configured
    const signedInUser = await signInWithGoogle();
    if (signedInUser) {
      router.push('/');
    }
  };

  if (authLoading || (user && isFirebaseConfigured)) { // Only show loading if configured and loading, or if user exists
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
            <div className="animate-pulse text-primary">Loading...</div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <LogoIcon className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Welcome to TutorVerse!</CardTitle>
          <CardDescription className="text-md text-muted-foreground pt-2">
            Sign in to continue your learning adventure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {!isFirebaseConfigured && (
            <Alert variant="destructive" className="mb-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                Firebase is not configured correctly. Please check the environment variables.
                Sign-in is currently unavailable.
              </AlertDescription>
            </Alert>
          )}
          <Button 
            onClick={handleSignIn} 
            className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
            disabled={authLoading || !isFirebaseConfigured}
          >
            <ChromeIcon className="mr-3 h-6 w-6" /> {/* Google G icon */}
            {authLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our imaginary Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
