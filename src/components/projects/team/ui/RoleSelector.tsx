
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProjectRoles } from '@/api/projects/modules/team/operations/fetchProjectRoles';
import type { ProjectRole } from '@/api/projects/modules/team/types';
import { Loader2 } from 'lucide-react';

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  value, 
  onChange,
  disabled = false,
  className
}) => {
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadRoles = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        const projectRoles = await fetchProjectRoles();
        console.log('Fetched project roles:', projectRoles);
        
        if (projectRoles && projectRoles.length > 0) {
          setRoles(projectRoles);
        } else {
          // If no roles returned, use default roles
          console.log('No roles returned from API, using defaults');
          setRoles(getDefaultRoles());
        }
      } catch (error) {
        console.error('Error loading project roles:', error);
        setLoadError(error instanceof Error ? error : new Error('Failed to load roles'));
        // Fall back to default roles on error
        setRoles(getDefaultRoles());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoles();
  }, []);
  
  // Default roles to show if we can't load from the database
  const getDefaultRoles = (): ProjectRole[] => [
    { id: '1', role_key: 'team_member', description: 'Standard team member' },
    { id: '2', role_key: 'project_manager', description: 'Project manager with administrative permissions' },
    { id: '3', role_key: 'developer', description: 'Software developer' },
    { id: '4', role_key: 'designer', description: 'UI/UX designer' },
    { id: '5', role_key: 'client_stakeholder', description: 'Client with limited access' }
  ];
  
  return (
    <div className={className}>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={isLoading ? "Loading roles..." : "Select a role"} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Loading roles...</span>
            </div>
          ) : (
            roles.map(role => (
              <SelectItem 
                key={role.id} 
                value={role.role_key}
                title={role.description}
              >
                {role.role_key.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {loadError && (
        <p className="text-xs text-destructive mt-1">
          {loadError.message || 'Error loading roles. Using defaults.'}
        </p>
      )}
    </div>
  );
};

export default RoleSelector;
