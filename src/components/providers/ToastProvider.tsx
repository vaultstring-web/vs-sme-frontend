'use client';

import { Toaster } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster 
      position="top-right"
      theme={theme === 'dark' ? 'dark' : 'light'}
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '12px',
        },
      }}
    />
  );
}
