'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function DashboardLayout({ children, user }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <div className="flex flex-1">
        {/* Sidebar can go here if needed */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}