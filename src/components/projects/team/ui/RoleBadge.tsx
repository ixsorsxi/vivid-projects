
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  // Determine badge color based on role
  const getBadgeVariant = () => {
    const normalizedRole = role.toLowerCase();
    
    if (normalizedRole.includes('manager') || normalizedRole.includes('lead')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (normalizedRole.includes('developer') || normalizedRole.includes('engineer')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (normalizedRole.includes('designer') || normalizedRole.includes('ux')) {
      return 'bg-pink-100 text-pink-800 border-pink-200';
    } else if (normalizedRole.includes('qa') || normalizedRole.includes('test')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (normalizedRole.includes('owner') || normalizedRole.includes('stakeholder')) {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge className={`font-normal text-xs ${getBadgeVariant()}`} variant="outline">
      {role}
    </Badge>
  );
};

export default RoleBadge;
