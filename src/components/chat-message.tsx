"use client";

import type * as React from 'react';
import { User, Bot, Brain, Atom, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
  intent?: 'math' | 'physics' | 'other' | 'error' | 'greeting';
  isLoading?: boolean;
}

const IntentIcon: React.FC<{ intent?: Message['intent'] }> = ({ intent }) => {
  switch (intent) {
    case 'math':
      return <Brain className="h-4 w-4 text-accent" />;
    case 'physics':
      return <Atom className="h-4 w-4 text-accent" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'greeting':
      return <Sparkles className="h-4 w-4 text-primary" />
    default:
      return null;
  }
};

export const ChatMessage: React.FC<Message> = ({ role, content, intent, isLoading }) => {
  const isUser = role === 'user';

  const TypingIndicator = () => (
    <div className="typing-indicator flex space-x-1">
      <span>●</span>
      <span>●</span>
      <span>●</span>
    </div>
  );

  return (
    <div className={cn('flex items-end space-x-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <Card className={cn(
        'max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl shadow-md',
        isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'
      )}>
        <CardContent className="p-3">
          {intent && !isUser && (
            <div className="flex items-center space-x-1.5 mb-1.5">
              <IntentIcon intent={intent} />
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {intent === 'other' ? 'TutorVerse' : intent}
              </span>
            </div>
          )}
          {isLoading ? <TypingIndicator /> : (
            typeof content === 'string' ? (
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            ) : (
              content
            )
          )}
        </CardContent>
      </Card>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
