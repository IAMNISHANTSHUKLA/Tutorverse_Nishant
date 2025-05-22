// src/app/layout.tsx
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TutorVerse',
  description: 'Your AI powered Math and Physics Tutor',
  // To add a favicon:
  // 1. Create a favicon.ico (or icon.png, icon.svg, etc.)
  // 2. Place it in the `src/app/` directory.
  // Next.js will automatically detect and use it.
  // If `/favicon.ico` is returning a 404, it means this file is missing.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
