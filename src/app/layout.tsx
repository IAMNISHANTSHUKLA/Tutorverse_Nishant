
// src/app/layout.tsx
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // For displaying notifications

// Setup custom fonts using next/font
const geistSans = Geist({
  variable: '--font-geist-sans', // CSS variable for sans-serif font
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono', // CSS variable for mono-spaced font
  subsets: ['latin'],
});

/**
 * Metadata for the application.
 * This includes the title, description, and instructions for the favicon.
 */
export const metadata: Metadata = {
  title: 'TutorVerse',
  description: 'Your AI powered Math and Physics Tutor',
  // To add a favicon:
  // 1. Create a favicon.ico (or icon.png, icon.svg, etc.)
  // 2. Place it in the `src/app/` directory.
  // Next.js will automatically detect and use common filenames like favicon.ico or icon.png.
  // If you use a different name, you might need to specify it in the `icons` field here:
  // icons: { icon: '/path/to/your/icon.png' }
  // If `/favicon.ico` is returning a 404, it means this file is missing from `src/app/`.
};

/**
 * RootLayout component: The main layout for the entire application.
 * It sets up the HTML structure, applies global styles and fonts,
 * and includes the Toaster component for notifications.
 * Authentication provider has been removed.
 *
 * @param {Readonly<{children: React.ReactNode}>} props - Props for the layout.
 * @returns {React.ReactNode} The rendered layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Main content of the application */}
        {children}
        {/* Toaster component for displaying global notifications/toasts */}
        <Toaster />
      </body>
    </html>
  );
}
