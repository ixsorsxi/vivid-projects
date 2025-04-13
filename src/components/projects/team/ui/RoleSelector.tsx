
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProjectRoles } from '@/api/projects/modules/team/operations/fetchProjectRoles';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProjectRole, ProjectRoleKey } from '@/api/projects/modules/team/types';
import { debugLog, debugError } from '@/utils/debugLogger';

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange, disabled = false }) => {
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        debugLog('RoleSelector', 'Fetching project roles');
        const projectRoles = await fetchProjectRoles();
        
        if (projectRoles && projectRoles.length > 0) {
          debugLog('RoleSelector', `Loaded ${projectRoles.length} project roles`);
          setRoles(projectRoles);
        } else {
          debugLog('RoleSelector', 'No roles returned, using defaults');
          // If no roles fetched, set default roles
          setRoles([
            { id: '1', role_key: 'team_member', description: 'Standard team member' },
            { id: '2', role_key: 'project_manager', description: 'Project manager with advanced permissions' },
            { id: '3', role_key: 'developer', description: 'Software developer' },
            { id: '4', role_key: 'designer', description: 'UI/UX designer' }
          ]);
        }
      } catch (error) {
        debugError('RoleSelector', 'Error loading roles:', error);
        setError('Failed to load roles. Using default options.');
        
        // Set default roles on error
        setRoles([
          { id: '1', role_key: 'team_member', description: 'Standard team member' },
          { id: '2', role_key: 'project_manager', description: 'Project manager with advanced permissions' },
          { id: '3', role_key: 'developer', description: 'Software developer' },
          { id: '4', role_key: 'designer', description: 'UI/UX designer' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleSelectRole = (role: string) => {
    onChange(role);
  };

  // Format role for display
  const formatRoleDisplay = (role: string) => {
    return role
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Find the selected role description
  const getSelectedRoleDescription = () => {
    const role = roles.find(r => r.role_key === value);
    return role?.description || '';
  };

  return (
    <div className="space-y-2">
      <Select
        value={value}
        onValueChange={handleSelectRole}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a role">
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              formatRoleDisplay(value)
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading roles...</span>
            </div>
          ) : (
            roles.map(role => (
              <SelectItem key={role.id} value={role.role_key}>
                {formatRoleDisplay(role.role_key)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {!isLoading && !error && value && (
        <p className="text-xs text-muted-foreground">
          {getSelectedRoleDescription()}
        </p>
      )}
    </div>
  );
};

export default RoleSelector;
