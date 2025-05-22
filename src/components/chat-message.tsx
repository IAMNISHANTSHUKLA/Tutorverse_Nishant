
// src/components/chat-message.tsx
"use client";

import type * as React from 'react';
import { User, Bot, Brain, Atom, AlertCircle, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Defines the structure of a chat message object.
 */
export interface Message {
  id: string; // Unique identifier for the message.
  role: 'user' | 'assistant'; // Role of the message sender.
  content: string | React.ReactNode; // Content can be text or more complex React nodes.
  intent?: 'math' | 'physics' | 'other' | 'error' | 'greeting'; // Helps style or identify the source/type of assistant message.
  isLoading?: boolean; // Indicates if the message is a loading placeholder (e.g., "Thinking...").
}

/**
 * IntentIcon component: Displays an icon based on the assistant's message intent.
 * @param {object} props - Component props.
 * @param {Message['intent']} props.intent - The intent of the assistant's message.
 * @returns {React.ReactElement} An icon element.
 */
const IntentIcon: React.FC<{ intent?: Message['intent'] }> = ({ intent }) => {
  switch (intent) {
    case 'math':
      // Using a distinct color for Math for subject differentiation
      return <Brain className="h-5 w-5 text-blue-500" />;
    case 'physics':
      // Using a distinct color for Physics
      return <Atom className="h-5 w-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case 'greeting':
      return <Sparkles className="h-5 w-5 text-primary" />; // Theme primary color (Teal) for greeting
    case 'other':
      return <MessageCircleQuestion className="h-5 w-5 text-muted-foreground" />;
    default:
      // Default icon if intent is undefined or not specifically handled
      return <Sparkles className="h-5 w-5 text-primary" />;
  }
};

/**
 * AgentName component: Displays the name of the AI agent based on intent.
 * @param {object} props - Component props.
 * @param {Message['intent']} props.intent - The intent of the assistant's message.
 * @returns {React.ReactElement} A span element with the agent's name.
 */
const AgentName: React.FC<{ intent?: Message['intent'] }> = ({ intent }) => {
  let name = "TutorVerse";
  let nameClass = "font-semibold text-primary"; // Default to Teal

  switch (intent) {
    case 'math':
      name = "Math Whiz";
      nameClass = "font-semibold text-blue-600"; // Blue for Math
      break;
    case 'physics':
      name = "Physics Pro";
      nameClass = "font-semibold text-green-600"; // Green for Physics
      break;
    case 'error':
      name = "Oops!";
      nameClass = "font-semibold text-destructive";
      break;
    // Greeting and Other intents will use the default "TutorVerse" and primary color
  }
  return <span className={cn("text-sm", nameClass)}>{name}</span>;
};


/**
 * TypingIndicator component: Renders a simple visual indicator for when the AI is "typing" or processing.
 * @returns {React.ReactElement} A div containing animated dots.
 */
const TypingIndicator = () => (
  <div className="typing-indicator flex space-x-1.5 items-center h-5 text-primary"> {/* Typing indicator uses primary color (Teal) */}
    <span className="h-2 w-2 bg-current rounded-full"></span>
    <span className="h-2 w-2 bg-current rounded-full"></span>
    <span className="h-2 w-2 bg-current rounded-full"></span>
  </div>
);

/**
 * ChatMessage component: Renders a single chat message in the conversation.
 * Styles messages differently based on the role (user or assistant) and intent (for assistant).
 * User messages are styled with the accent color (Orange).
 * Assistant messages use the card background, with specific agent names/icons.
 *
 * @param {Message} props - The message object to render.
 * @returns {React.ReactElement} A div representing the chat message.
 */
export const ChatMessage: React.FC<Message> = ({ role, content, intent, isLoading }) => {
  const isUser = role === 'user';

  return (
    <div className={cn(
      'flex items-end space-x-3 group', // Base styling for a message row
      isUser ? 'justify-end' : 'justify-start' // Align user messages to the right, assistant to the left
    )}>
      {/* Avatar for assistant messages, shown on the left */}
      {!isUser && (
        <Avatar className="h-9 w-9 self-start mt-1 shadow-md">
          {/* Assistant avatar uses primary theme color (Teal) */}
          <AvatarFallback className="bg-gradient-to-br from-primary to-teal-400 text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Card containing the message content */}
      <Card className={cn(
        'max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl shadow-lg transition-all duration-300 ease-out transform group-hover:scale-[1.01]',
        isUser
          ? 'bg-gradient-to-br from-accent to-orange-400 text-accent-foreground rounded-br-md' // User message: Orange gradient
          : 'bg-card text-card-foreground rounded-bl-md border-2 border-primary/20' // Assistant message: Card style with Teal border
      )}>
        <CardContent className="p-3.5">
          {/* Display intent icon and agent name for assistant messages */}
          {!isUser && (
            <div className="flex items-center space-x-2 mb-2 border-b border-border pb-1.5">
              <IntentIcon intent={intent} />
              <AgentName intent={intent} />
            </div>
          )}

          {/* Display typing indicator if loading, otherwise display the actual message content */}
          {isLoading ? <TypingIndicator /> : (
            typeof content === 'string' ? (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
            ) : (
              content // Allows rendering ReactNode content directly (e.g., for more complex messages)
            )
          )}
        </CardContent>
      </Card>

      {/* Avatar for user messages, shown on the right */}
      {isUser && (
        <Avatar className="h-9 w-9 self-start mt-1 shadow-md">
          {/* User avatar uses accent theme color (Orange) */}
          <AvatarFallback className="bg-gradient-to-br from-accent to-orange-300 text-accent-foreground">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
