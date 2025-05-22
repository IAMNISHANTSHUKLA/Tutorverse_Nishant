
// src/components/auth-components.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, User as UserIcon, Settings, LayoutDashboard, AlertTriangle } from 'lucide-react'; // Added Settings, LayoutDashboard, AlertTriangle
import { Skeleton } from './ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function AuthStatus() {
  const { user, isLoading, signOut, isFirebaseConfigured } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (!isFirebaseConfigured) return;
    await signOut();
    router.push('/signin'); // Optionally redirect to sign-in after sign-out
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-24 rounded-md" />;
  }

  if (!isFirebaseConfigured) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive cursor-not-allowed">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Auth Error
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Firebase not configured. Authentication unavailable.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!user) {
    return (
      <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
        <Link href="/signin">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Link>
      </Button>
    );
  }

  const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10 border-2 border-primary/50 hover:border-primary transition-colors">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || 'Learner'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || 'No email provided'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Example items - can be linked to actual pages later */}
        <DropdownMenuItem onClick={() => router.push('/')}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled> {/* Example of a disabled item */}
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
