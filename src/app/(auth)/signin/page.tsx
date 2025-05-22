
// src/app/(auth)/signin/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChromeIcon, AlertTriangle, WifiOff } from 'lucide-react'; 
import { LogoIcon } from '@/components/icons/logo';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignInPage() {
  const { user, signInWithGoogle, isLoading: authLoading, isFirebaseConfigured } = useAuth();
  const router = useRouter();
  // const [signInError, setSignInError] = React.useState<string | null>(null); // Local error state is less needed as context handles toasts

  React.useEffect(() => {
    if (user && !authLoading && isFirebaseConfigured) {
      router.push('/'); // Redirect to home if already signed in and Firebase is configured
    }
  }, [user, authLoading, router, isFirebaseConfigured]);

  const handleSignIn = async () => {
    // setSignInError(null); // Clear previous errors
    if (!isFirebaseConfigured) {
        // Toast is handled by AuthContext, but we could show a local alert too if needed
        return;
    }
    const signedInUser = await signInWithGoogle();
    if (signedInUser) {
      router.push('/');
    }
    // Else: signInWithGoogle in AuthContext already handles toasts for errors.
  };

  if (authLoading || (!authLoading && user && isFirebaseConfigured)) { 
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="animate-pulse text-primary text-lg font-semibold">Loading your adventure...</div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-yellow-50 to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl bg-card border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6">
            <LogoIcon className="h-20 w-20 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Welcome to TutorVerse!</CardTitle>
          <CardDescription className="text-md text-muted-foreground pt-2">
            {isFirebaseConfigured 
              ? "Sign in with Google to start your learning journey."
              : "Authentication is currently unavailable."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {!isFirebaseConfigured && (
            <Alert variant="destructive">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>Authentication System Offline</AlertTitle>
              <AlertDescription>
                Firebase is not configured correctly. Please check the browser console for more details or contact support.
                Sign-in features are currently disabled.
              </AlertDescription>
            </Alert>
          )}
          {/* {signInError && isFirebaseConfigured && ( // Only show local error if Firebase is configured
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Sign-in Failed</AlertTitle>
              <AlertDescription>{signInError}</AlertDescription>
            </Alert>
          )} */}
          <Button 
            onClick={handleSignIn} 
            className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md"
            disabled={authLoading || !isFirebaseConfigured} // Disable if auth is loading OR Firebase not configured
          >
            <ChromeIcon className="mr-3 h-6 w-6" />
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
