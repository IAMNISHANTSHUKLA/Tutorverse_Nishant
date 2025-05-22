import type * as React from 'react';

export function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 16H6L2 20V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H18C18.5304 2 19.0391 2.21071 19.4142 2.58579C19.7893 2.96086 20 3.46957 20 4V16Z"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 6.5L9 8L7.5 9.5L6 8L7.5 6.5Z"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--accent))"
        strokeWidth="0.5"
      />
      <path
        d="M12.5 8.5L14 10L12.5 11.5L11 10L12.5 8.5Z"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--accent))"
        strokeWidth="0.5"

      />
       <path
        d="M15.5 5.5L17 7L15.5 8.5L14 7L15.5 5.5Z"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--accent))"
        strokeWidth="0.5"
      />
    </svg>
  );
}
