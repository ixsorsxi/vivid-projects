
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProjectRoles } from '@/api/projects/modules/team/rolePermissions';
import type { ProjectRole } from '@/api/projects/modules/team/types';

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  value, 
  onChange,
  disabled = false
}) => {
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadRoles = async () => {
      setIsLoading(true);
      try {
        const projectRoles = await fetchProjectRoles();
        setRoles(projectRoles);
      } catch (error) {
        console.error('Error loading project roles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoles();
  }, []);
  
  // If we don't have roles yet, show default options
  const defaultRoles = [
    { role_key: 'team_member', description: 'Regular team member' },
    { role_key: 'developer', description: 'Software developer' },
    { role_key: 'designer', description: 'UI/UX designer' },
    { role_key: 'project_manager', description: 'Project manager with administrative permissions' }
  ];
  
  const displayRoles = roles.length > 0 ? roles : defaultRoles;
  
  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        {displayRoles.map((role) => (
          <SelectItem 
            key={role.role_key} 
            value={role.role_key}
          >
            {role.role_key.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RoleSelector;
