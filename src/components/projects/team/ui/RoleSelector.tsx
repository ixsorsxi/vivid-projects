
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchProjectRoles } from '@/api/projects/modules/team'; // This should now be correctly imported
import { ProjectRole } from '@/api/projects/modules/team/types';
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
  className = '' 
}) => {
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const projectRoles = await fetchProjectRoles();
        setRoles(projectRoles);
      } catch (error) {
        console.error('Error loading project roles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRoles();
  }, []);
  
  // If the value doesn't match any role_key, default to team_member
  useEffect(() => {
    if (!loading && roles.length > 0 && value && !roles.some(r => r.role_key === value)) {
      const defaultRole = roles.find(r => r.role_key === 'team_member');
      if (defaultRole) {
        onChange(defaultRole.role_key);
      }
    }
  }, [value, roles, loading, onChange]);
  
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || loading}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={loading ? "Loading roles..." : "Select a role"} />
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Loading roles...</span>
          </div>
        ) : (
          roles.map(role => (
            <SelectItem key={role.id} value={role.role_key}>
              <div className="flex flex-col">
                <span className="font-medium">
                  {role.role_key.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {role.description}
                </span>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default RoleSelector;
