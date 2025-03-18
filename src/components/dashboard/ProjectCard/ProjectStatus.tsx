
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ProjectStatus as Status } from '@/lib/types/common';

interface ProjectStatusProps {
  status: Status | string;
}

const ProjectStatus: React.FC<ProjectStatusProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'not-started':
        return { label: 'Not Started', variant: 'outline' as const };
      case 'in-progress':
        return { label: 'In Progress', variant: 'default' as const };
      case 'on-hold':
        return { label: 'On Hold', variant: 'secondary' as const };
      case 'completed':
        return { label: 'Completed', variant: 'success' as const };
      case 'cancelled':
        // Changed to use 'outline' instead of 'destructive' to match allowed variants
        return { label: 'Cancelled', variant: 'outline' as const, className: "bg-red-100 text-red-800 border-red-200" };
      default:
        return { label: status, variant: 'outline' as const };
    }
  };

  const { label, variant, className } = getStatusConfig(status as string);

  return <Badge variant={variant} className={className}>{label}</Badge>;
};

export default ProjectStatus;
