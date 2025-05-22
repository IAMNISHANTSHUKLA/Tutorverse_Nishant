// src/app/page.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SendHorizonal, MessageSquareDashed, Sparkles, ArrowRight, UserCheck, Star, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, type Message } from '@/components/chat-message';
import { LogoIcon } from '@/components/icons/logo';
import { processUserQuery } from './actions';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthStatus } from '@/components/auth-components'; // Import AuthStatus
import { useAuth } from '@/contexts/auth-context'; // Import useAuth

/**
 * HomePage component: Serves as the main interface for the TutorVerse application.
 * It includes a welcome section and a chat interface for users to interact with AI tutors.
 */
export default function HomePage() {
  const [query, setQuery] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'initial-greeting',
      role: 'assistant',
      content: "Hello there, curious learner! I'm TutorVerse, your friendly guide to the wonders of Math and Physics. What amazing question do you have for me today?",
      intent: 'greeting',
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { user, isLoading: authIsLoading } = useAuth(); // Get user and auth loading state

  // Scroll to the bottom of the chat messages when new messages are added.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(scrollToBottom, [messages]);

  // Focus the input field when the component mounts or when user logs in/out (if not already focused)
  React.useEffect(() => {
    if (!authIsLoading && document.activeElement !== inputRef.current) {
       setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [authIsLoading, user]);

  // Handles the submission of the user's query.
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
    };
    const loadingMessageId = (Date.now() + 1).toString(); // Unique ID for loading message
    const loadingMessage: Message = {
      id: loadingMessageId,
      role: 'assistant',
      content: 'Thinking...', 
      isLoading: true,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage, loadingMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const result = await processUserQuery(userMessage.content as string);
      const assistantMessage: Message = {
        id: loadingMessageId, 
        role: 'assistant',
        content: result.text,
        intent: result.intent,
      };
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === loadingMessageId ? assistantMessage : msg))
      );
    } catch (error) {
      console.error('Failed to process query:', error);
      const errorMessage: Message = {
        id: loadingMessageId,
        role: 'assistant',
        content: 'Oh no! Something went a bit wobbly. Please try asking again.',
        intent: 'error',
      };
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg))
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // Welcome section with conditional rendering based on auth state
  const WelcomeSection = () => (
    <div className="relative w-full h-auto md:h-[calc(100vh-280px)] min-h-[300px] rounded-lg overflow-hidden shadow-xl mb-8 flex items-center justify-center p-4">
      <Image
        src="https://placehold.co/1200x600/E0F2FE/0EA5E9?text=Welcome+Explorers!" // Cheerful placeholder
        alt="Friendly learning environment with kids and abstract shapes"
        layout="fill"
        objectFit="cover"
        data-ai-hint="children learning education"
        className="opacity-30"
      />
      <div className="relative z-10 text-center p-4 md:p-8 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl">
        <div className="flex justify-center mb-4">
          <LogoIcon className="h-20 w-20 text-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
          Welcome to <span className="text-accent">TutorVerse</span>!
        </h2>
        <p className="text-lg md:text-xl text-foreground mb-6">
          Your amazing AI-powered adventure in Math and Physics starts right here. Ask questions, explore concepts, and unlock your inner genius!
        </p>
        {!authIsLoading && !user && (
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 shadow-lg transform hover:scale-105 transition-transform">
            <Link href="/signin">
              Join the Adventure! <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        )}
        {user && (
           <p className="text-xl font-semibold text-secondary">Ready to explore, {user.displayName || 'Explorer'}?</p>
        )}
      </div>
    </div>
  );

  // Feature cards
  const FeatureCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-primary"><Sparkles className="mr-2 h-6 w-6 text-accent" />AI-Powered Tutoring</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Get instant help with tricky math and physics problems from our smart AI tutors.</CardDescription>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-primary"><Rocket className="mr-2 h-6 w-6 text-accent" />Explore & Discover</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Dive deep into concepts, ask "what if" questions, and satisfy your curiosity.</CardDescription>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-primary"><Star className="mr-2 h-6 w-6 text-accent" />Fun & Engaging</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Learning doesn't have to be boring! We make complex topics easy to understand.</CardDescription>
        </CardContent>
      </Card>
    </div>
  );


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/50">
      <header className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-md z-20 shadow-md">
        <Link href="/" className="flex items-center space-x-3">
          <LogoIcon className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-primary flex items-center">
            TutorVerse
          </h1>
        </Link>
        <AuthStatus /> {/* AuthStatus component for sign-in/out and user avatar */}
      </header>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col p-0 md:p-4">
          <ScrollArea className="flex-1" id="message-scroll-area">
            <div className="p-4 md:p-6 space-y-6">
              {/* Display welcome section only if no user messages yet (besides initial greeting) */}
              {messages.length <= 1 && (
                <>
                  <WelcomeSection />
                  {!user && !authIsLoading && <FeatureCards />}
                </>
              )}
              
              {/* Display chat messages if there are more than the initial greeting OR if user is logged in */}
              {(messages.length > 1 || (user && !authIsLoading)) && messages.map((msg) => (
                <ChatMessage key={msg.id} {...msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Initial placeholder for chat if user is logged in and only greeting message exists */}
            {user && !authIsLoading && messages.length === 1 && messages[0].intent === 'greeting' && (
              <div className="flex flex-col items-center justify-center text-center p-10 text-muted-foreground mt-8">
                <MessageSquareDashed className="w-20 h-20 mb-6 text-primary/70" />
                <p className="text-xl font-semibold text-foreground">Ask me anything about Math or Physics!</p>
                <p className="text-md mt-1">For example: &quot;What is pi?&quot; or &quot;Explain gravity!&quot;</p>
              </div>
            )}
          </ScrollArea>

          {/* Chat input footer - show only if user is logged in or if it's not the initial welcome screen for logged-out users */}
          { (user || messages.length > 1 || authIsLoading) && (
            <footer className="p-4 border-t border-border bg-background/90 sticky bottom-0 backdrop-blur-sm">
              <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
                <Input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={user ? "Type your question here, explorer!" : "Sign in to ask questions!"}
                  className="flex-1 rounded-full px-6 py-4 text-base focus-visible:ring-primary shadow-inner"
                  disabled={isLoading || (!user && !authIsLoading)} // Disable if not signed in and not in auth loading state
                  aria-label="Your question"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 disabled:bg-muted shadow-lg transform hover:scale-105 transition-transform"
                  disabled={isLoading || !query.trim() || (!user && !authIsLoading)} // Disable if not signed in and not in auth loading state
                  aria-label="Send question"
                >
                  <SendHorizonal className={cn("h-6 w-6", isLoading ? "animate-pulse" : "")} />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Made with <span className="text-red-500">❤️</span> by Nishant Shukla.
                TutorVerse can make mistakes. Consider checking important information.
              </p>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}
