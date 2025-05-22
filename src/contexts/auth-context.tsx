
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
  isFirebaseConfigured: boolean; // New state to indicate if Firebase auth is usable
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Check if Firebase auth object from config is available
  const isFirebaseConfigured = !!auth && !!googleAuthProvider; 
  const { toast } = useToast();

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn("AuthContext: Firebase is not configured. Authentication will be disabled.");
      setIsLoading(false);
      setUser(null);
      // Optionally, show a persistent warning to the user or developer
      // toast({
      //   title: "Authentication System Offline",
      //   description: "Firebase is not configured correctly. Please check console.",
      //   variant: "destructive",
      //   duration: Infinity
      // });
      return;
    }

    // If Firebase is configured, proceed with onAuthStateChanged
    const unsubscribe = onAuthStateChanged(auth!, (currentUser) => { // auth! is safe here due to isFirebaseConfigured check
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [isFirebaseConfigured, toast]);

  const signInWithGoogle = async (): Promise<User | null> => {
    if (!isFirebaseConfigured || !auth || !googleAuthProvider) {
      toast({
        title: "Sign-In Unavailable",
        description: "Authentication system is not configured. Please contact support or check console.",
        variant: "destructive",
      });
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
      let errorMessage = "Failed to sign in with Google. Please try again.";
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in popup was closed. Please try again.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Sign-in was cancelled. Please try again if this was a mistake.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Sign-in popup was blocked by the browser. Please allow popups for this site.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Google Sign-In is not enabled for this project. Please check Firebase console.";
      } else if (error.message) {
        errorMessage = `Sign-in failed: ${error.message}`;
      }
      toast({
        title: "Sign-in Error",
        description: errorMessage,
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
        title: "Sign-Out Unavailable",
        description: "Authentication system is not configured.",
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
