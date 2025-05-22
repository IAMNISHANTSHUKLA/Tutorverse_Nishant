
// src/app/page.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SendHorizonal, MessageSquareDashed, Sparkles, Rocket, BookOpen, Lightbulb, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, type Message } from '@/components/chat-message';
import { LogoIcon } from '@/components/icons/logo';
import { processUserQuery } from './actions';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AuthStatus } from '@/components/auth-components'; 
import { useAuth } from '@/contexts/auth-context'; 

/**
 * HomePage component: Serves as the main interface for the TutorVerse application.
 * It includes a welcome section and a chat interface for users to interact with AI tutors.
 * Styled with a child-friendly theme: Teal (primary), Light Yellow (background), Orange (accent).
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
  const { user, isLoading: authIsLoading, isFirebaseConfigured } = useAuth();

  // Scroll to the bottom of the chat messages when new messages are added.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(scrollToBottom, [messages]);

  // Focus the input field when the component mounts or when user logs in/out, if Firebase is configured
  React.useEffect(() => {
    if (isFirebaseConfigured && !authIsLoading && document.activeElement !== inputRef.current) {
       setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [authIsLoading, user, isFirebaseConfigured]);

  // Handles the submission of the user's query.
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFirebaseConfigured || !query.trim() || isLoading || !user) return; 

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
    };
    const loadingMessageId = (Date.now() + 1).toString();
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
      if (isFirebaseConfigured) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  // Welcome section with conditional rendering based on auth state
  const WelcomeSection = () => (
    <div className="relative w-full h-auto md:h-[calc(100vh-350px)] min-h-[350px] rounded-lg overflow-hidden shadow-xl mb-10 flex items-center justify-center p-4 bg-secondary/10">
      <Image
        src="https://placehold.co/1200x600/FFFFE0/008080" 
        alt="A cheerful and inviting learning environment with abstract educational icons"
        fill
        style={{ objectFit: "cover" }}
        data-ai-hint="education learning kids"
        className="opacity-20"
      />
      <div className="relative z-10 text-center p-6 md:p-10 bg-background/80 backdrop-blur-md rounded-xl shadow-2xl max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <LogoIcon className="h-24 w-24 text-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
          Explore the Universe of Knowledge!
        </h2>
        <p className="text-lg md:text-xl text-foreground mb-8">
          TutorVerse is your fun, AI-powered pal for mastering Math and Physics. Let's learn something new today!
        </p>
        {!authIsLoading && !user && isFirebaseConfigured && (
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-6 sm:px-10 py-4 sm:py-7 shadow-lg transform hover:scale-105 transition-transform rounded-full">
            <Link href="/signin">
              Start Your Adventure! <Rocket className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        )}
         {user && isFirebaseConfigured && (
           <p className="text-2xl font-semibold text-accent">Ready to explore, {user.displayName || 'Explorer'}?</p>
        )}
        {!isFirebaseConfigured && (
           <Alert variant="destructive" className="mt-4 max-w-lg mx-auto">
             <AlertTriangle className="h-4 w-4" />
             <AlertTitle>Authentication Unavailable</AlertTitle>
             <AlertDescription>
               Sign-in is currently not working due to a configuration issue. Please check the console for details.
             </AlertDescription>
           </Alert>
        )}
      </div>
    </div>
  );

  // Feature cards - more descriptive and child-friendly
  const FeatureCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4">
      <Card className="hover:shadow-xl transition-shadow duration-300 bg-card/90 backdrop-blur-sm border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center text-primary"><Sparkles className="mr-2 h-7 w-7 text-accent" />Smart AI Buddy</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-md">Ask any Math or Physics question. Our AI tutor explains things simply!</CardDescription>
        </CardContent>
      </Card>
      <Card className="hover:shadow-xl transition-shadow duration-300 bg-card/90 backdrop-blur-sm border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center text-primary"><BookOpen className="mr-2 h-7 w-7 text-accent" />Learn & Discover</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-md">Explore tricky topics, understand formulas, and see how cool science is!</CardDescription>
        </CardContent>
      </Card>
      <Card className="hover:shadow-xl transition-shadow duration-300 bg-card/90 backdrop-blur-sm border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center text-primary"><Lightbulb className="mr-2 h-7 w-7 text-accent" />Boost Your Brain!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-md">Make learning an exciting game. Become a Math Whiz or Physics Pro!</CardDescription>
        </CardContent>
      </Card>
    </div>
  );


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b border-border/70 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-20 shadow-md">
        <Link href="/" className="flex items-center space-x-3">
          <LogoIcon className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-primary flex items-center">
            TutorVerse
          </h1>
        </Link>
        <AuthStatus /> 
      </header>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col p-0 md:p-4">
          <ScrollArea className="flex-1" id="message-scroll-area">
            <div className="p-4 md:p-6 space-y-6">
              {messages.length <= 1 && !user && !authIsLoading && ( 
                <>
                  <WelcomeSection />
                  <FeatureCards />
                </>
              )}
              
              { (messages.length > 1 || (user && !authIsLoading)) && messages.map((msg) => (
                <ChatMessage key={msg.id} {...msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {user && !authIsLoading && isFirebaseConfigured && messages.length === 1 && messages[0].intent === 'greeting' && (
              <div className="flex flex-col items-center justify-center text-center p-10 text-muted-foreground mt-8">
                <MessageSquareDashed className="w-24 h-24 mb-6 text-primary/70" />
                <p className="text-xl font-semibold text-foreground">Ask me anything about Math or Physics!</p>
                <p className="text-md mt-1">For example: &quot;What is pi?&quot; or &quot;Explain gravity!&quot;</p>
              </div>
            )}
             {!isFirebaseConfigured && !authIsLoading && messages.length === 1 && (
                <div className="flex flex-col items-center justify-center text-center p-10 text-muted-foreground mt-8">
                    <AlertTriangle className="w-24 h-24 mb-6 text-destructive/70" />
                    <p className="text-xl font-semibold text-destructive">Chat Unavailable</p>
                    <p className="text-md mt-1 text-foreground">
                        The chat functionality is temporarily disabled due to a configuration issue.
                        Please ensure Firebase is set up correctly.
                    </p>
                </div>
            )}
          </ScrollArea>

          <footer className="p-4 border-t border-border/70 bg-background/85 sticky bottom-0 backdrop-blur-sm">
            <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
              <Input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  !isFirebaseConfigured
                    ? "Chat unavailable (Firebase not configured)"
                    : user 
                      ? "Type your question here, explorer!" 
                      : "Please sign in to ask questions!"
                }
                className="flex-1 rounded-full px-6 py-4 text-base focus-visible:ring-primary shadow-inner bg-input text-foreground placeholder:text-muted-foreground"
                disabled={isLoading || !user || !isFirebaseConfigured } 
                aria-label="Your question"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 disabled:bg-muted/70 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform"
                disabled={isLoading || !query.trim() || !user || !isFirebaseConfigured }
                aria-label="Send question"
              >
                <SendHorizonal className={cn("h-6 w-6", isLoading ? "animate-pulse" : "")} />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Made with Love by Nishant Shukla.
              TutorVerse can make mistakes. Consider checking important information.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
