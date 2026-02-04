// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VaultString SME Loans',
  description: 'Apply for business or payroll loans',
};

<<<<<<< HEAD
=======
import { AuthProvider } from '../context/AuthContext';

>>>>>>> origin/auth
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={inter.className}>{children}</body>
=======
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
>>>>>>> origin/auth
    </html>
  );
}