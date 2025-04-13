
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProjectRoles } from '@/api/projects/modules/team/operations/fetchProjectRoles';
import type { ProjectRole } from '@/api/projects/modules/team/types';
import { Loader2 } from 'lucide-react';
import { debugLog, debugError } from '@/utils/debugLogger';

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
        debugLog('RoleSelector', 'Loading project roles');
        const projectRoles = await fetchProjectRoles();
        
        if (projectRoles && projectRoles.length > 0) {
          debugLog('RoleSelector', `Loaded ${projectRoles.length} project roles`);
          setRoles(projectRoles);
        } else {
          debugError('RoleSelector', 'No project roles returned from API');
          setLoadError(new Error('Failed to load roles'));
        }
      } catch (error) {
        debugError('RoleSelector', 'Error loading project roles:', error);
        setLoadError(error instanceof Error ? error : new Error('Failed to load roles'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoles();
  }, []);
  
  const formatRoleDisplay = (roleKey: string): string => {
    return roleKey.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const getRoleDescription = (roleKey: string): string => {
    const role = roles.find(r => r.role_key === roleKey);
    return role?.description || '';
  };
  
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
          ) : roles.length > 0 ? (
            roles.map(role => (
              <SelectItem 
                key={role.id} 
                value={role.role_key}
                title={role.description}
              >
                {formatRoleDisplay(role.role_key)}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground">
              {loadError ? 'Error loading roles' : 'No roles available'}
            </div>
          )}
        </SelectContent>
      </Select>
      
      {loadError && (
        <p className="text-xs text-destructive mt-1">
          {loadError.message || 'Error loading roles. Using defaults.'}
        </p>
      )}
      
      {value && !loadError && (
        <p className="text-xs text-muted-foreground mt-1">
          {getRoleDescription(value) || 'This role determines the permissions for this team member'}
        </p>
      )}
    </div>
  );
};

export default RoleSelector;
