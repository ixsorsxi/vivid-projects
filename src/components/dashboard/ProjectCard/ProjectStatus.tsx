
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
        return { label: 'Cancelled', variant: 'destructive' as const };
      default:
        return { label: status, variant: 'outline' as const };
    }
  };

  const { label, variant } = getStatusConfig(status);

  return <Badge variant={variant}>{label}</Badge>;
};

export default ProjectStatus;
