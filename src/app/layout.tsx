// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ApplicationsProvider } from '../context/ApplicationsContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AppLocalizationProvider } from '../components/providers/AppLocalizationProvider';
import { ToastProvider } from '../components/providers/ToastProvider';
import QueryProvider from '../components/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VaultString SME Loans | Thrive MFI',
  description: 'Accessible, tech-enabled loans for salaried workers and SMEs in Malawi',
  icons: {
    icon: "/icons/favicon.svg",
    shortcut: "/icons/favicon.svg",
    apple: "/icons/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider>
          <AppLocalizationProvider>
            <AuthProvider>
            <QueryProvider>
            <ApplicationsProvider>
              {children}
              <ToastProvider />
            </ApplicationsProvider>
            </QueryProvider>
            </AuthProvider>
          </AppLocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}