'use client';

import { CheckCircle2, XCircle, Clock, FileText, Edit, AlertCircle } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  notes: string;
  timestamp: string;
  actor: {
    fullName: string;
  };
}

interface ApplicationTimelineProps {
  logs: AuditLog[];
}

export default function ApplicationTimeline({ logs }: ApplicationTimelineProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center p-6 text-slate-500 text-sm">
        No history available.
      </div>
    );
  }

  const getIcon = (action: string) => {
    switch (action) {
      case 'APPROVED': return <CheckCircle2 className="w-5 h-5 text-white" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-white" />;
      case 'SUBMITTED': return <FileText className="w-5 h-5 text-white" />;
      case 'DATA_EDITED': return <Edit className="w-5 h-5 text-white" />;
      default: return <Clock className="w-5 h-5 text-white" />;
    }
  };

  const getColor = (action: string) => {
    switch (action) {
      case 'APPROVED': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      case 'SUBMITTED': return 'bg-blue-500';
      case 'DATA_EDITED': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="relative pl-6 ml-2 border-l-2 border-border space-y-8 py-2">
      {logs.map((log) => (
        <div key={log.id} className="relative">
          {/* Dot */}
          <div className={`absolute -left-[37px] top-1 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border-4 border-card ${getColor(log.action)}`}>
            {getIcon(log.action)}
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-sm">
                {log.action.replace('_', ' ')}
              </span>
              <span className="text-xs text-foreground/50">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            
            <p className="text-xs font-medium text-foreground/60">
              by {log.actor?.fullName || 'System'}
            </p>
            
            {log.notes && (
              <div className="mt-2 p-3 rounded-lg text-sm text-foreground/80 border border-border">
                {log.notes}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
