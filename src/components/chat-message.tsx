// src/components/chat-message.tsx
"use client";

import type * as React from 'react';
import { User, Bot, Brain, Atom, AlertCircle, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

// Defines the structure of a chat message.
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode; // Content can be text or React nodes.
  intent?: 'math' | 'physics' | 'other' | 'error' | 'greeting'; // Intent helps style or identify the message source.
  isLoading?: boolean; // Indicates if the message is a loading placeholder.
}

// Component to display an icon based on the message intent.
const IntentIcon: React.FC<{ intent?: Message['intent'] }> = ({ intent }) => {
  // Using PRD colors: Teal (primary), Orange (accent)
  // Math: Blue (distinct subject color)
  // Physics: Green (distinct subject color)
  switch (intent) {
    case 'math':
      return <Brain className="h-5 w-5 text-blue-500" />; 
    case 'physics':
      return <Atom className="h-5 w-5 text-green-500" />; 
    case 'error':
      return <AlertCircle className="h-5 w-5 text-destructive" />; 
    case 'greeting':
      return <Sparkles className="h-5 w-5 text-primary" />; // Teal for greeting
    case 'other':
      return <MessageCircleQuestion className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Sparkles className="h-5 w-5 text-primary" />; // Default to primary if undefined
  }
};

// Component to display the name of the AI agent based on intent.
const AgentName: React.FC<{ intent?: Message['intent'] }> = ({ intent }) => {
  let name = "TutorVerse";
  let className = "font-semibold text-primary"; // Default to Teal

  switch (intent) {
    case 'math':
      name = "Math Whiz";
      className = "font-semibold text-blue-600"; // Keeping blue for Math differentiation
      break;
    case 'physics':
      name = "Physics Pro";
      className = "font-semibold text-green-600"; // Keeping green for Physics differentiation
      break;
    case 'error':
      name = "Oops!";
      className = "font-semibold text-destructive";
      break;
    // Greeting and Other will use the default "TutorVerse" and primary color
  }
  return <span className={cn("text-sm", className)}>{name}</span>;
};


// Component for the typing indicator animation.
const TypingIndicator = () => (
  <div className="typing-indicator flex space-x-1.5 items-center h-5 text-primary"> {/* Typing indicator uses primary color */}
    <span className="h-2 w-2 bg-current rounded-full"></span>
    <span className="h-2 w-2 bg-current rounded-full"></span>
    <span className="h-2 w-2 bg-current rounded-full"></span>
  </div>
);

/**
 * ChatMessage component: Renders a single chat message.
 * Styles messages differently based on role and intent.
 * User messages: Accent color (Orange)
 * Assistant messages: Card background, with specific agent names/icons.
 */
export const ChatMessage: React.FC<Message> = ({ role, content, intent, isLoading }) => {
  const isUser = role === 'user';

  return (
    <div className={cn('flex items-end space-x-3 group', isUser ? 'justify-end' : 'justify-start')}>
      {/* Avatar for assistant messages */}
      {!isUser && (
        <Avatar className="h-9 w-9 self-start mt-1 shadow-md">
          {/* Assistant avatar uses primary (Teal) */}
          <AvatarFallback className="bg-gradient-to-br from-primary to-teal-400 text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <Card className={cn(
        'max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl shadow-lg transition-all duration-300 ease-out transform group-hover:scale-[1.01]',
        isUser 
          ? 'bg-gradient-to-br from-accent to-orange-400 text-accent-foreground rounded-br-md' // User message is Orange
          : 'bg-card text-card-foreground rounded-bl-md border-2 border-primary/20' // Assistant uses card, border is Teal
      )}>
        <CardContent className="p-3.5">
          {/* Display intent icon and agent name for assistant messages */}
          {!isUser && (
            <div className="flex items-center space-x-2 mb-2 border-b border-border pb-1.5">
              <IntentIcon intent={intent} />
              <AgentName intent={intent} />
            </div>
          )}
          {/* Display typing indicator if loading, otherwise display content */}
          {isLoading ? <TypingIndicator /> : (
            typeof content === 'string' ? (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
            ) : (
              content // Allows rendering ReactNode content
            )
          )}
        </CardContent>
      </Card>
      {/* Avatar for user messages */}
      {isUser && (
        <Avatar className="h-9 w-9 self-start mt-1 shadow-md">
          {/* User avatar uses accent (Orange) */}
          <AvatarFallback className="bg-gradient-to-br from-accent to-orange-300 text-accent-foreground">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
