'use client';
import { SessionProvider } from 'next-auth/react';
import { AppProvider } from '@/lib/AppContext';

export { useApp } from '@/lib/AppContext';

export function Providers({ children, theme, lang }: { children: React.ReactNode; theme?: string; lang?: string }) {
  return (
    <SessionProvider>
      <AppProvider>{children}</AppProvider>
    </SessionProvider>
  );
}
