'use client';

import { ReactNode, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: string;
  /** When set, replaces the default title + close header (include your own close control). */
  customHeader?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Max width of the card (Tailwind class) */
  maxWidthClassName?: string;
  /** Extra classes on the card */
  className?: string;
  /** Extra classes on the scrollable body wrapper */
  contentClassName?: string;
  hideCloseButton?: boolean;
}

/**
 * Accessible modal: backdrop dismiss, Escape, body scroll lock,
 * max viewport height with scrollable body and stacked footer on mobile.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  customHeader,
  children,
  footer,
  maxWidthClassName = 'max-w-md',
  className = '',
  contentClassName = '',
  hideCloseButton = false,
}: ModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = prev;
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`bento-card relative z-10 flex w-full ${maxWidthClassName} max-h-[90dvh] flex-col overflow-hidden bg-card shadow-2xl animate-in fade-in zoom-in duration-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {customHeader != null ? (
          <div className="shrink-0 border-b border-border">{customHeader}</div>
        ) : (
          (title != null || !hideCloseButton) && (
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0 flex-1">
                {title != null && (
                  <h2 className="text-lg font-bold text-foreground sm:text-xl">{title}</h2>
                )}
                {subtitle != null && subtitle !== '' && (
                  <p className="mt-1 break-words text-sm text-foreground/60">{subtitle}</p>
                )}
              </div>
              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )
        )}

        <div className={`min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 ${contentClassName}`}>{children}</div>

        {footer != null && (
          <div className="shrink-0 border-t border-border px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
