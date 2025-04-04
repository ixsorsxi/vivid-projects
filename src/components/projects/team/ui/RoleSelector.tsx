
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProjectRoles } from '@/api/projects/modules/team/rolePermissions';
import type { ProjectRole, ProjectRoleKey } from '@/api/projects/modules/team/types';

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
        console.log('Fetched project roles:', projectRoles);
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
  const defaultRoles: {role_key: ProjectRoleKey, description: string}[] = [
    { role_key: 'team_member', description: 'Regular team member' },
    { role_key: 'developer', description: 'Software developer' },
    { role_key: 'designer', description: 'UI/UX designer' },
    { role_key: 'project_manager', description: 'Project manager with administrative permissions' },
    { role_key: 'admin', description: 'Administrator with full permissions' },
    { role_key: 'scrum_master', description: 'Scrum master for agile projects' },
    { role_key: 'business_analyst', description: 'Business analyst who defines requirements' },
    { role_key: 'qa_tester', description: 'Quality assurance tester' },
    { role_key: 'client_stakeholder', description: 'Client or stakeholder with limited access' },
    { role_key: 'observer_viewer', description: 'Observer with view-only permissions' }
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
            title={role.description}
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
