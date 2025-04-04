
import React from 'react';
import { Badge } from '@/components/ui/badge.custom';
import { cva } from 'class-variance-authority';
import { Check, Clock, AlertTriangle, HourglassIcon } from 'lucide-react';

const statusBadgeVariants = cva("", {
  variants: {
    status: {
      "not-started": "bg-slate-100 text-slate-700 border-slate-200",
      "in-progress": "bg-blue-500/15 text-blue-600 border-blue-500/20",
      "on-hold": "bg-amber-500/15 text-amber-600 border-amber-500/20",
      "completed": "bg-emerald-500/15 text-emerald-600 border-emerald-500/20"
    }
  },
  defaultVariants: {
    status: "not-started"
  }
});

// Status badge helper with enhanced styling
export const getStatusBadge = (status: string) => {
  const iconClassNames = "h-3.5 w-3.5 mr-1";
  
  switch (status) {
    case 'not-started':
      return (
        <Badge variant="outline" size="sm" className={statusBadgeVariants({ status: "not-started" })}>
          <HourglassIcon className={iconClassNames} />
          Not Started
        </Badge>
      );
    case 'in-progress':
      return (
        <Badge variant="primary" size="sm" className={statusBadgeVariants({ status: "in-progress" })}>
          <Clock className={iconClassNames} />
          In Progress
        </Badge>
      );
    case 'on-hold':
      return (
        <Badge variant="primary" size="sm" dot className={statusBadgeVariants({ status: "on-hold" })}>
          <AlertTriangle className={iconClassNames} />
          On Hold
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="success" size="sm" className={statusBadgeVariants({ status: "completed" })}>
          <Check className={iconClassNames} />
          Completed
        </Badge>
      );
    default:
      return null;
  }
};

// Priority badge helper with enhanced styling
export const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'low':
      return <Badge className="bg-blue-500/15 text-blue-500 border-blue-500/20 font-medium" size="sm">Low</Badge>;
    case 'medium':
      return <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/20 font-medium" size="sm">Medium</Badge>;
    case 'high':
      return <Badge className="bg-rose-500/15 text-rose-500 border-rose-500/20 font-medium shadow-sm" size="sm">High</Badge>;
    default:
      return null;
  }
};

// Date formatter with enhanced display
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  }).format(date);
};
