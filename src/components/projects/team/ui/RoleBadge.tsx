
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  // Normalize role to handle different formatting
  const normalizedRole = role.toLowerCase().trim();
  
  // Determine badge style based on role
  let variant: 'default' | 'secondary' | 'outline' = 'outline';
  
  if (normalizedRole.includes('manager') || normalizedRole === 'project manager') {
    variant = 'default';
  } else if (['developer', 'designer', 'engineer'].some(r => normalizedRole.includes(r))) {
    variant = 'secondary';
  }
  
  return (
    <Badge variant={variant} className="mt-1">
      {role}
    </Badge>
  );
};

export default RoleBadge;
