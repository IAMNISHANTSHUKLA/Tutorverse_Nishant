// src/components/chat-message.tsx
"use client";

import type * as React from 'react';
import { User, Bot, Brain, Atom, AlertCircle, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Removed AvatarImage as it's not used
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
  switch (intent) {
    case 'math':
      return <Brain className="h-5 w-5 text-blue-500" />; // Math icon
    case 'physics':
      return <Atom className="h-5 w-5 text-green-500" />; // Physics icon
    case 'error':
      return <AlertCircle className="h-5 w-5 text-destructive" />; // Error icon
    case 'greeting':
      return <Sparkles className="h-5 w-5 text-primary" />; // Greeting icon
    case 'other':
      return <MessageCircleQuestion className="h-5 w-5 text-gray-500" />; // Default/other icon
    default:
      return null;
  }
};

// Component to display the name of the AI agent based on intent.
const AgentName: React.FC<{ intent?: Message['intent'] }> = ({ intent }) => {
  let name = "TutorVerse";
  let className = "text-primary"; // Default color

  switch (intent) {
    case 'math':
      name = "Math Whiz";
      className = "text-blue-600 font-semibold";
      break;
    case 'physics':
      name = "Physics Pro";
      className = "text-green-600 font-semibold";
      break;
    case 'error':
      name = "Oops!";
      className = "text-destructive font-semibold";
      break;
    case 'greeting':
      name = "TutorVerse";
      className = "text-primary font-semibold";
      break;
    case 'other':
      name = "TutorVerse";
      className = "text-gray-600 font-semibold";
      break;
  }
  return <span className={cn("text-sm", className)}>{name}</span>;
};


// Component for the typing indicator animation.
const TypingIndicator = () => (
  <div className="typing-indicator flex space-x-1.5 items-center h-5">
    <span className="h-2 w-2 bg-current rounded-full"></span>
    <span className="h-2 w-2 bg-current rounded-full"></span>
    <span className="h-2 w-2 bg-current rounded-full"></span>
  </div>
);

/**
 * ChatMessage component: Renders a single chat message.
 * It styles messages differently based on whether they are from the user or the assistant,
 * and displays an intent icon and agent name for assistant messages.
 */
export const ChatMessage: React.FC<Message> = ({ role, content, intent, isLoading }) => {
  const isUser = role === 'user';

  return (
    <div className={cn('flex items-end space-x-3 group', isUser ? 'justify-end' : 'justify-start')}>
      {/* Avatar for assistant messages */}
      {!isUser && (
        <Avatar className="h-9 w-9 self-start mt-1">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <Card className={cn(
        'max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl shadow-lg transition-all duration-300 ease-out transform group-hover:scale-[1.01]',
        isUser 
          ? 'bg-gradient-to-br from-primary to-teal-500 text-primary-foreground rounded-br-md' 
          : 'bg-card text-card-foreground rounded-bl-md border-2 border-primary/20'
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
        <Avatar className="h-9 w-9 self-start mt-1">
          <AvatarFallback className="bg-gradient-to-br from-secondary to-orange-400 text-secondary-foreground shadow-md">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
