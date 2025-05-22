
// src/components/icons/logo.tsx
import type * as React from 'react';

/**
 * LogoIcon component: Renders the application's logo as an SVG.
 * The logo is a stylized chat bubble with abstract 'sparkle' or 'idea' elements inside.
 * Colors are based on CSS variables for theme consistency.
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
      {/* Main chat bubble shape, using primary color for stroke and a light fill */}
      <path
        d="M24 18H8.33024C7.64854 18 7.04574 18.3706 6.77809 18.9697L3 26V4C3 3.46957 3.21071 2.96086 3.58579 2.58579C3.96086 2.21071 4.46957 2 5 2H23C23.5304 2 24.0391 2.21071 24.4142 2.58579C24.7893 2.96086 25 3.46957 25 4V18Z"
        stroke="hsl(var(--primary))" // Teal stroke
        strokeWidth="2.5" // Slightly thicker for a bolder, more playful look
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="hsl(var(--background))" // Light yellow fill, matching app background
        className="shadow-lg" // Adding a subtle shadow via Tailwind if possible or use filter
      />
      {/* Inner shadow/highlight for depth - subtle */}
       <path
        d="M23 5C23 4.46957 22.7893 3.96086 22.4142 3.58579C22.0391 3.21071 21.5304 3 21 3H6C5.46957 3 4.96086 3.21071 4.58579 3.58579C4.21071 3.96086 4 4.46957 4 5V17H22.85L23 5Z"
        fill="hsl(var(--primary) / 0.1)" // Very light teal fill for a subtle 3D effect
      />

      {/* Sparkle/Idea element 1 - A simple star, using accent color */}
      <path
        d="M10 8 L10.5 9.5 L12 10 L10.5 10.5 L10 12 L9.5 10.5 L8 10 L9.5 9.5 Z"
        fill="hsl(var(--accent))" // Orange fill
        stroke="hsl(var(--accent) / 0.7)" // Slightly darker orange stroke
        strokeWidth="0.5"
      />
      {/* Sparkle/Idea element 2 - A small circle/dot, using secondary color */}
       <circle
        cx="15"
        cy="12.5" // Adjusted position slightly
        r="1.8" // Slightly larger
        fill="hsl(var(--secondary))" // Muted teal fill
        stroke="hsl(var(--secondary) / 0.7)"
        strokeWidth="0.5"
      />
      {/* Sparkle/Idea element 3 - A slightly larger star, using accent color */}
      <path
        d="M18.5 7 L19.25 8.75 L21 9.25 L19.25 9.75 L18.5 11.5 L17.75 9.75 L16 9.25 L17.75 8.75 Z" // Adjusted points for a slightly different star shape
        fill="hsl(var(--accent))" // Orange fill
        stroke="hsl(var(--accent) / 0.7)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

    