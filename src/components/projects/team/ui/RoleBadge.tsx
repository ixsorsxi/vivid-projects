
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getVariant = () => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('manager') || lowerRole.includes('lead')) {
      return 'default';
    } else if (lowerRole.includes('dev') || lowerRole.includes('engineer')) {
      return 'outline';
    } else if (lowerRole.includes('design')) {
      return 'secondary';
    } else {
      return 'outline';
    }
  };
  
  return (
    <Badge variant={getVariant()} className="text-xs">
      {role}
    </Badge>
  );
};

export default RoleBadge;
