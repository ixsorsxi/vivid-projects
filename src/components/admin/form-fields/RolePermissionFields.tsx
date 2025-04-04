
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UserFormData } from '../hooks/useUserDialogState';

interface RolePermissionFieldsProps {
  formData: UserFormData;
  handleInputChange: (key: keyof UserFormData, value: string) => void;
  handleRoleChange: (value: 'admin' | 'user' | 'manager') => void;
}

const RolePermissionFields: React.FC<RolePermissionFieldsProps> = ({
  formData,
  handleInputChange,
  handleRoleChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Role & Permissions</h3>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleRoleChange(value as 'admin' | 'user' | 'manager')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {formData.role === 'admin' ? 'Administrators have full access to all system features.' : 
             formData.role === 'manager' ? 'Managers can manage projects and teams, but have limited system access.' : 
             'Regular users have basic access to assigned projects and tasks.'}
          </p>
        </div>
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="status">Account Status</Label>
            <Switch
              id="status"
              checked={formData.status === 'active'}
              onCheckedChange={(checked) => 
                handleInputChange('status', checked ? 'active' : 'inactive')
              }
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formData.status === 'active' ? 
              'User can log in and access the system.' : 
              'User account is disabled and cannot log in.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionFields;
