
import React from 'react';
import { Badge } from '@/components/ui/badge.custom';

// Status badge helper
export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'not-started':
      return <Badge variant="outline" size="sm">Not Started</Badge>;
    case 'in-progress':
      return <Badge variant="primary" size="sm">In Progress</Badge>;
    case 'on-hold':
      return <Badge variant="primary" className="bg-amber-500/15 text-amber-500 border-amber-500/20" size="sm" dot>On Hold</Badge>;
    case 'completed':
      return <Badge variant="success" size="sm">Completed</Badge>;
    default:
      return null;
  }
};

// Priority badge helper
export const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'low':
      return <Badge className="bg-blue-500/15 text-blue-500 border-blue-500/20" size="sm">Low</Badge>;
    case 'medium':
      return <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/20" size="sm">Medium</Badge>;
    case 'high':
      return <Badge className="bg-rose-500/15 text-rose-500 border-rose-500/20" size="sm">High</Badge>;
    default:
      return null;
  }
};

// Date formatter
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};
