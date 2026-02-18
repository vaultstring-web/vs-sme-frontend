'use client';

import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/FormELements';

interface EditableFieldProps {
  label: string;
  value: string | number;
  fieldName: string;
  type?: 'text' | 'number' | 'date';
  isEditing: boolean;
  onSave: (field: string, value: string | number) => Promise<void>;
}

export default function EditableField({ 
  label, 
  value, 
  fieldName, 
  type = 'text', 
  isEditing, 
  onSave 
}: EditableFieldProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // If global edit mode is off, local edit is forced off
  if (!isEditing && isLocalEditing) {
    setIsLocalEditing(false);
  }

  const handleSave = async () => {
    if (currentValue === value) {
      setIsLocalEditing(false);
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(fieldName, currentValue);
      setIsLocalEditing(false);
    } catch (error) {
      console.error('Save failed', error);
      // Revert on error
      setCurrentValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsLocalEditing(false);
  };

  return (
    <div className="flex flex-col gap-1 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group">
      <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider">
        {label}
      </span>
      
      {isEditing && isLocalEditing ? (
        <div className="flex items-center gap-2">
          <Input 
            type={type}
            value={currentValue}
            onChange={(e) => setCurrentValue(type === 'number' ? Number(e.target.value) : e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="p-1 text-green-600 hover:bg-green-100 rounded"
          >
            <Check size={16} />
          </button>
          <button 
            onClick={handleCancel}
            disabled={isSaving} 
            className="p-1 text-red-600 hover:bg-red-100 rounded"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground truncate">
            {value?.toString() || '-'}
          </span>
          {isEditing && (
            <button 
              onClick={() => setIsLocalEditing(true)}
              className="opacity-0 group-hover:opacity-100 p-1 text-foreground/40 hover:text-primary-600 transition-all"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
