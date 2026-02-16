'use client';
import { useState, useEffect } from 'react';
import { Header } from './Header';
import { AdminSidebar } from './AdminSidebar';
import { Footer } from './Footer';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (isSidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen, isMobile]);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area - REMOVED lg:ml-72 which was causing double margin */}
        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

          {/* Main Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full">
            <div className="max-w-7xl mx-auto w-full">
              <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 lg:p-8 shadow-sm">
                {children}
              </div>
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
}
