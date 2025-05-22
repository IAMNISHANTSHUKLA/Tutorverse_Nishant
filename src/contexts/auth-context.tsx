
// src/contexts/auth-context.tsx
'use client';

import type * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase/config'; // auth can now be null
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isFirebaseConfigured = !!auth; // Check if Firebase auth was initialized

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      console.warn("AuthProvider: Firebase is not configured. Auth features will be disabled.");
      return;
    }

    // This line ensures auth is not null before passing to onAuthStateChanged
    if (auth) {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
        });
        return () => unsubscribe();
    }
  }, [isFirebaseConfigured]);

  const signInWithGoogle = async (): Promise<User | null> => {
    if (!isFirebaseConfigured || !auth || !googleAuthProvider) {
      toast({
        title: "Authentication Unavailable",
        description: "Firebase is not configured correctly. Please contact support or check environment variables.",
        variant: "destructive",
      });
      setIsLoading(false); // Ensure loading state is updated
      return null;
    }
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      setUser(result.user);
      toast({ title: "Signed in successfully!", description: `Welcome, ${result.user.displayName || 'learner'}!` });
      return result.user;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Sign-in Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isFirebaseConfigured || !auth) {
      toast({
        title: "Authentication Unavailable",
        description: "Firebase is not configured correctly.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast({ title: "Signed out", description: "You have been successfully signed out." });
    } catch (error: any)      {
      console.error("Error signing out:", error);
      toast({
        title: "Sign-out Error",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isFirebaseConfigured, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
