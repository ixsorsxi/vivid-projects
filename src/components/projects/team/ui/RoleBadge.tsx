
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  if (!role) return null;
  
  // Format role for display
  const formattedRole = role.replace(/-/g, ' ');
  
  // Determine badge variant based on role
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
  
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes('manager') || lowerRole.includes('admin')) {
    variant = 'default';
  } else if (lowerRole.includes('lead')) {
    variant = 'secondary';
  }
  
  return (
    <Badge variant={variant} className="capitalize">
      {formattedRole}
    </Badge>
  );
};

export default RoleBadge;
