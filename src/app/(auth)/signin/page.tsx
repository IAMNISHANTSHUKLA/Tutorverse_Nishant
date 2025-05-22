
// src/app/(auth)/signin/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChromeIcon, AlertTriangle } from 'lucide-react'; // Using ChromeIcon as a stand-in for Google G
import { LogoIcon } from '@/components/icons/logo';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignInPage() {
  const { user, signInWithGoogle, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [signInError, setSignInError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user && !authLoading) {
      router.push('/'); // Redirect to home if already signed in
    }
  }, [user, authLoading, router]);

  const handleSignIn = async () => {
    setSignInError(null); // Clear previous errors
    const signedInUser = await signInWithGoogle();
    if (signedInUser) {
      router.push('/');
    } else if (!authLoading) { 
      // signInWithGoogle now internally handles toasts for errors.
      // We can set a local error state if needed for specific UI feedback here.
      // For now, toast is primary feedback. If needed, we can check if firebase is configured to show a specific message.
      // setSignInError("Sign-in failed. Please try again. Check console for details if the problem persists.");
    }
  };

  if (authLoading || (!authLoading && user)) { // Show loading if auth is loading OR if user exists (to allow redirect to kick in)
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="animate-pulse text-primary text-lg font-semibold">Loading your adventure...</div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-yellow-50 to-secondary/10 p-4"> {/* Light Yellow gradient */}
      <Card className="w-full max-w-md shadow-2xl bg-card border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6">
            <LogoIcon className="h-20 w-20 text-primary" /> {/* Teal logo */}
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Welcome to TutorVerse!</CardTitle> {/* Teal title */}
          <CardDescription className="text-md text-muted-foreground pt-2">
            Sign in with Google to start your learning journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {signInError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Sign-in Failed</AlertTitle>
              <AlertDescription>{signInError}</AlertDescription>
            </Alert>
          )}
          <Button 
            onClick={handleSignIn} 
            className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md" // Teal button
            disabled={authLoading}
          >
            <ChromeIcon className="mr-3 h-6 w-6" /> {/* Google G icon */}
            {authLoading ? 'Signing In...' : 'Sign in with Google'}
          </Button>
          <p className="text-xs text-muted-foreground text-center pt-4">
            By signing in, you agree to our (imaginary) Terms of Service and Privacy Policy. Learning should be fun and safe!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
