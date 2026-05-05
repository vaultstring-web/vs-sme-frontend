// src/components/ui/FormElements.tsx
import React from 'react';

const baseInputStyles = "w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`${baseInputStyles} ${props.className}`} />
);

export const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`${baseInputStyles} ${props.className}`}>
    {children}
  </select>
);

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`${baseInputStyles} min-h-25 ${props.className}`} />
);

export const Checkbox = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="flex cursor-pointer items-center gap-2 py-1 group">
    <input type="checkbox" {...props} className="h-5 w-5 shrink-0 rounded border-border bg-background text-accent focus:ring-accent" />
    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
  </label>
);