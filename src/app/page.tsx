// src/app/page.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { SendHorizonal, MessageSquareDashed, Sparkles, BookOpen, Atom as AtomIcon, Brain as BrainIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, type Message } from '@/components/chat-message';
import { LogoIcon } from '@/components/icons/logo';
import { processUserQuery } from './actions';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  // Focus the input field when the component mounts.
  React.useEffect(() => {
    inputRef.current?.focus();
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
    const loadingMessageId = (Date.now() + 1).toString(); // Unique ID for loading message
    const loadingMessage: Message = {
      id: loadingMessageId,
      role: 'assistant',
      content: 'Thinking...', // This will be replaced by the typing indicator in ChatMessage
      isLoading: true,
    };

    // Add user message and loading indicator to the chat.
    setMessages((prevMessages) => [...prevMessages, userMessage, loadingMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      // Process the user query via the server action.
      const result = await processUserQuery(userMessage.content as string);
      const assistantMessage: Message = {
        id: loadingMessageId, // Use same ID to replace loading message
        role: 'assistant',
        content: result.text,
        intent: result.intent,
      };
      // Replace loading message with the actual assistant response.
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === loadingMessageId ? assistantMessage : msg))
      );
    } catch (error) {
      console.error('Failed to process query:', error);
      const errorMessage: Message = {
        id: loadingMessageId, // Use same ID to replace loading message
        role: 'assistant',
        content: 'Oh no! Something went a bit wobbly. Please try asking again.',
        intent: 'error',
      };
      // Replace loading message with an error message.
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg))
      );
    } finally {
      setIsLoading(false);
      // Ensure input is focused after processing is complete.
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // Placeholder for an engaging illustration
  const WelcomeIllustration = () => (
    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-xl mb-8">
      <Image
        src="https://placehold.co/800x400.png"
        alt="Friendly learning environment"
        layout="fill"
        objectFit="cover"
        data-ai-hint="children learning"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent flex flex-col items-center justify-end p-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2 shadow-black/50 text-shadow">Welcome to TutorVerse!</h2>
        <p className="text-lg md:text-xl text-primary-foreground shadow-black/50 text-shadow">Your adventure in Math and Physics starts now!</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted/50">
      <header className="p-4 border-b border-border flex items-center space-x-3 sticky top-0 bg-background/95 backdrop-blur-md z-20 shadow-lg">
        <LogoIcon className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-primary flex items-center">
          TutorVerse <Sparkles className="h-6 w-6 ml-2 text-accent" />
        </h1>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col p-0 md:p-4">
          <ScrollArea className="flex-1" id="message-scroll-area">
            <div className="p-4 md:p-6 space-y-6">
              {/* Display welcome illustration only if no user messages yet (besides initial greeting) */}
              {messages.length <= 1 && <WelcomeIllustration />}
              {messages.map((msg) => (
                <ChatMessage key={msg.id} {...msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Initial placeholder if only greeting message exists */}
            {messages.length === 1 && messages[0].intent === 'greeting' && (
              <div className="flex flex-col items-center justify-center text-center p-10 text-muted-foreground mt-8">
                <MessageSquareDashed className="w-20 h-20 mb-6 text-primary/70" />
                <p className="text-xl font-semibold text-foreground">Ask me anything about Math or Physics!</p>
                <p className="text-md mt-1">For example: &quot;What is pi?&quot; or &quot;Explain gravity!&quot;</p>
              </div>
            )}
          </ScrollArea>

          <footer className="p-4 border-t border-border bg-background/90 sticky bottom-0 backdrop-blur-sm">
            <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
              <Input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your question here, explorer!"
                className="flex-1 rounded-full px-6 py-4 text-base focus-visible:ring-primary shadow-inner"
                disabled={isLoading}
                aria-label="Your question"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 disabled:bg-muted shadow-lg transform hover:scale-105 transition-transform"
                disabled={isLoading || !query.trim()}
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
        </main>

        {/* Optional Sidebar for future examples or navigation - hidden for now to maximize chat */}
        {/* <aside className="w-full md:w-72 bg-card p-4 border-l border-border hidden md:block">
          <h2 className="text-xl font-semibold mb-4 text-primary">Learning Zone</h2>
           <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><BrainIcon className="mr-2 h-5 w-5 text-secondary"/>Math Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Remember PEMDAS for order of operations!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><AtomIcon className="mr-2 h-5 w-5 text-secondary"/>Physics Facts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Gravity keeps us on the ground!</p>
            </CardContent>
          </Card>
        </aside> */}
      </div>
    </div>
  );
}
