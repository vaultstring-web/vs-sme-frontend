// src/components/ui/Feedback.tsx
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-primary-100 dark:bg-primary-900/20 rounded-md ${className}`} />
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="p-6 border-2 border-dashed border-error-main/20 rounded-2xl bg-error-main/5 text-center">
    <p className="text-error-main font-medium">{message}</p>
    <button onClick={() => window.location.reload()} className="mt-2 text-sm underline opacity-70">Try again</button>
  </div>
);