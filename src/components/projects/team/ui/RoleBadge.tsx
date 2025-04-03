
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  // Format role for display
  const formattedRole = role?.replace(/-/g, ' ');
  
  // Determine badge variant based on role
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
  
  if (role?.toLowerCase().includes('manager') || role?.toLowerCase().includes('admin')) {
    variant = 'default';
  } else if (role?.toLowerCase().includes('lead')) {
    variant = 'secondary';
  }
  
  return (
    <Badge variant={variant} className="capitalize">
      {formattedRole}
    </Badge>
  );
};

export default RoleBadge;
