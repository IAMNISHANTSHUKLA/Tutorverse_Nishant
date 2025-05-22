'use client';

import * as React from 'react';
import { SendHorizonal, MessageSquareDashed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, type Message } from '@/components/chat-message';
import { LogoIcon } from '@/components/icons/logo';
import { processUserQuery } from './actions';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [query, setQuery] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'initial-greeting',
      role: 'assistant',
      content: "Hello! I'm TutorVerse. How can I help you with Math or Physics today?",
      intent: 'greeting',
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(scrollToBottom, [messages]);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
        id: loadingMessageId, // Use same ID to replace loading message
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
        id: loadingMessageId, // Use same ID to replace loading message
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        intent: 'error',
      };
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg))
      );
    } finally {
      setIsLoading(false);
      // Wait for state to update and then focus
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b border-border flex items-center space-x-3 sticky top-0 bg-background/90 backdrop-blur-md z-10 shadow-sm">
        <LogoIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-semibold text-foreground">TutorVerse</h1>
      </header>

      <ScrollArea className="flex-1" id="message-scroll-area">
        <div className="p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} {...msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        {messages.length === 1 && messages[0].intent === 'greeting' && ( // Only show if it's just the greeting
           <div className="flex flex-col items-center justify-center text-center p-10 text-muted-foreground">
             <MessageSquareDashed className="w-16 h-16 mb-4" />
             <p className="text-lg font-medium">Ready when you are!</p>
             <p className="text-sm">Ask any Math or Physics question to get started.</p>
           </div>
         )}
      </ScrollArea>

      <footer className="p-4 border-t border-border bg-background sticky bottom-0">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about Math or Physics..."
            className="flex-1 rounded-full px-5 py-3 text-base focus-visible:ring-accent"
            disabled={isLoading}
            aria-label="Your question"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 disabled:bg-muted" 
            disabled={isLoading || !query.trim()}
            aria-label="Send question"
          >
            <SendHorizonal className={cn("h-5 w-5", isLoading ? "animate-pulse" : "")} />
          </Button>
        </form>
         <p className="text-xs text-muted-foreground mt-2 text-center">
            TutorVerse can make mistakes. Consider checking important information.
        </p>
      </footer>
    </div>
  );
}
