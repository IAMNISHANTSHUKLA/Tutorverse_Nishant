// src/components/icons/logo.tsx
import type * as React from 'react';

/**
 * LogoIcon component: Renders the application's logo as an SVG.
 * The logo is a stylized chat bubble with abstract 'sparkle' or 'idea' elements inside.
 */
export function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="48" // Increased size for better visibility
      height="48" // Increased size
      viewBox="0 0 28 28" // Adjusted viewBox for new design elements
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Main chat bubble shape */}
      <path
        d="M24 18H8.33024C7.64854 18 7.04574 18.3706 6.77809 18.9697L3 26V4C3 3.46957 3.21071 2.96086 3.58579 2.58579C3.96086 2.21071 4.46957 2 5 2H23C23.5304 2 24.0391 2.21071 24.4142 2.58579C24.7893 2.96086 25 3.46957 25 4V18Z"
        stroke="hsl(var(--primary))"
        strokeWidth="2" // Slightly thicker stroke for a bolder look
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="hsl(var(--primary-foreground))" // Fill the bubble for a more solid look
      />
      {/* Sparkle/Idea element 1 - A simple star */}
      <path 
        d="M10 8 L10.5 9.5 L12 10 L10.5 10.5 L10 12 L9.5 10.5 L8 10 L9.5 9.5 Z"
        fill="hsl(var(--accent))" 
        stroke="hsl(var(--accent))"
        strokeWidth="0.5"
      />
      {/* Sparkle/Idea element 2 - A small circle/dot */}
       <circle 
        cx="15" 
        cy="12" 
        r="1.5" 
        fill="hsl(var(--secondary))" 
        stroke="hsl(var(--secondary))"
        strokeWidth="0.5"
      />
      {/* Sparkle/Idea element 3 - A slightly larger star */}
      <path 
        d="M18 7 L18.75 8.75 L20.5 9 L18.75 9.25 L18 11 L17.25 9.25 L15.5 9 L17.25 8.75 Z"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--accent))"
        strokeWidth="0.5"
      />
    </svg>
  );
}
