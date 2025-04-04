
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { mapLegacyRole } from '@/api/projects/modules/team'; // This should now be correctly imported

interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  // Map the role to a standardized key
  const roleKey = mapLegacyRole(role);
  
  // Get variant based on role type
  const getVariant = () => {
    switch (roleKey) {
      case 'project_manager':
        return 'default';
      case 'admin':
        return 'destructive';
      case 'project_owner':
        return 'secondary';
      case 'developer':
      case 'designer':
      case 'qa_tester':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  
  // Format role for display
  const formatRole = (roleKey: string) => {
    return roleKey.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <Badge variant={getVariant()} className="font-normal text-[10px]">
      {formatRole(roleKey)}
    </Badge>
  );
};

export default RoleBadge;
