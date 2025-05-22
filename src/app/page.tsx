
// src/app/page.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Keep Link for the header logo
import { SendHorizonal, MessageSquareDashed, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, type Message } from '@/components/chat-message';
import { LogoIcon } from '@/components/icons/logo';
import { processUserQuery } from './actions';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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

  // Scroll to the bottom of the chat messages when new messages are added.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(scrollToBottom, [messages]);

  // Focus the input field when the component mounts if no other element is active
  React.useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
       setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, []);

  // Handles the submission of the user's query.
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim() || isLoading) return;

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
      const errorMessageContent = (typeof error === 'object' && error !== null && 'message' in error)
        ? `Oh no! Something went a bit wobbly. Please try asking again. (Details: ${error.message})`
        : 'Oh no! Something went a bit wobbly. Please try asking again.';
      const errorMessage: Message = {
        id: loadingMessageId,
        role: 'assistant',
        content: errorMessageContent,
        intent: 'error',
      };
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg))
      );
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  // Welcome section
  const WelcomeSection = () => (
    <div className="relative w-full h-auto md:h-[calc(100vh-400px)] min-h-[400px] rounded-lg overflow-hidden shadow-xl mb-10 flex items-center justify-center p-4 bg-secondary/10">
      <Image
        src="https://placehold.co/1200x600/FFFFE0/008080.png"
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
        <p className="text-lg md:text-xl text-foreground mb-6">
          TutorVerse is your fun, AI-powered pal for mastering Math and Physics. Let's learn something new today!
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg px-6 sm:px-10 py-4 sm:py-7 text-xl font-semibold transform hover:scale-105 transition-transform mt-6" onClick={() => inputRef.current?.focus()}>
           Ask Your First Question!
        </Button>
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
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col p-0 md:p-4">
          <ScrollArea className="flex-1" id="message-scroll-area">
            <div className="p-4 md:p-6 space-y-6">
              {/* Show WelcomeSection and FeatureCards only if it's the initial greeting message */}
              {messages.length === 1 && messages[0].intent === 'greeting' && (
                <>
                  <WelcomeSection />
                  <FeatureCards />
                </>
              )}

              {messages.map((msg) => (
                <ChatMessage key={msg.id} {...msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* The MessageSquareDashed prompt for an empty chat has been removed
                as the WelcomeSection now serves as the primary initial guide.
                If messages were empty (e.g., after clearing, which isn't a feature yet),
                a different empty state could be considered here.
            */}
          </ScrollArea>

          <footer className="p-4 border-t border-border/70 bg-background/85 sticky bottom-0 backdrop-blur-sm">
            <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
              <Input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={"Ask me anything about Math or Physics!"}
                className="flex-1 rounded-full px-6 py-4 text-base focus-visible:ring-primary shadow-inner bg-input text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
                aria-label="Your question"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 disabled:bg-muted/70 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform"
                disabled={isLoading || !query.trim()}
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
