/**
 * Loading Spinner Component
 * Displays an animated loading indicator
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-primary-200 dark:border-primary-900"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-600 dark:border-t-primary-400 animate-spin"></div>
      </div>
      {text && <p className="text-sm text-foreground/60">{text}</p>}
    </div>
  );
}
