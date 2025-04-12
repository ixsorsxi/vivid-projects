
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { mapLegacyRole } from '@/api/projects/modules/team/permissions';

interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'default';
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'default' }) => {
  // Map the role to a standardized format
  const normalizedRole = mapLegacyRole(role);
  
  // Determine badge variant based on role
  const getBadgeVariant = () => {
    switch (normalizedRole) {
      case 'project_manager':
        return 'default';
      case 'project_owner':
        return 'destructive';
      case 'admin':
        return 'destructive';
      case 'team_member':
        return 'outline';
      case 'developer':
        return 'secondary';
      case 'designer':
        return 'secondary';
      case 'client_stakeholder':
        return 'outline';
      case 'observer_viewer':
        return 'outline';
      default:
        return 'outline';
    }
  };
  
  // Format the role name for display
  const formatRoleDisplay = (role: string) => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <Badge 
      variant={getBadgeVariant()} 
      className={size === 'sm' ? 'text-xs px-1.5 py-0' : ''}
    >
      {formatRoleDisplay(normalizedRole)}
    </Badge>
  );
};

export default RoleBadge;
