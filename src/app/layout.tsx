import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AppProvider } from '@/context/AppContext';
import { AppLayoutClient } from '@/components/layout/AppLayoutClient';

export const metadata: Metadata = {
  title: 'AMR FRNTR | Furniture & Fit-Out ERP Platform',
  description:
    'Enterprise Project Management & Operations Platform for luxury and commercial furniture fit-out businesses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f7fa] text-[#202b3c] antialiased">
        <AppProvider>
          <AppLayoutClient>{children}</AppLayoutClient>
        </AppProvider>
      </body>
    </html>
  );
}

