
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { projectRoles } from '../constants';
import { debugLog } from '@/utils/debugLogger';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  className?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
  disabled = false,
  required = true,
  label = "Role",
  className
}) => {
  const handleRoleChange = (value: string) => {
    debugLog('RoleSelector', 'Role selected:', value);
    onRoleChange(value);
  };

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="role" className="mb-2 block">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <Select
        value={selectedRole}
        onValueChange={handleRoleChange}
        disabled={disabled}
      >
        <SelectTrigger id="role" className="w-full">
          <SelectValue placeholder={`Select a role${required ? ' (required)' : ''}`} />
        </SelectTrigger>
        <SelectContent>
          {projectRoles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-xs text-muted-foreground mt-1">
        The role determines what permissions this team member will have
      </p>
    </div>
  );
};

export default RoleSelector;
