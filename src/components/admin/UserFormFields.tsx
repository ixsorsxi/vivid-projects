
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CustomRole, UserFormData } from './hooks/useUserDialogState';

interface UserFormFieldsProps {
  formData: UserFormData;
  customRoles: CustomRole[];
  isLoadingRoles: boolean;
  handleInputChange: (key: keyof UserFormData, value: string) => void;
  handleRoleChange: (value: 'admin' | 'user' | 'manager') => void;
  handleCustomRoleChange: (roleId: string) => void;
  mode: 'add' | 'edit';
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  formData,
  customRoles,
  isLoadingRoles,
  handleInputChange,
  handleRoleChange,
  handleCustomRoleChange,
  mode
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="John Doe"
          required
          className="focus-primary"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="john@example.com"
          required
          className="focus-primary"
          disabled={mode === 'edit'} // Email cannot be changed when editing
        />
      </div>
      
      {mode === 'add' && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="••••••••"
            required
            className="focus-primary"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="role">Basic Role</Label>
        <Select 
          value={formData.role} 
          onValueChange={handleRoleChange}
        >
          <SelectTrigger className="focus-primary">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="customRole">Custom Role</Label>
        <Select 
          value={formData.customRoleId} 
          onValueChange={handleCustomRoleChange}
        >
          <SelectTrigger className="focus-primary">
            <SelectValue placeholder="Select custom role" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingRoles ? (
              <SelectItem value="">Loading roles...</SelectItem>
            ) : customRoles.length === 0 ? (
              <SelectItem value="">No custom roles available</SelectItem>
            ) : (
              customRoles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name} ({role.base_type})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Custom roles provide specific permissions beyond the basic role.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value: 'active' | 'inactive') => handleInputChange('status', value)}
        >
          <SelectTrigger className="focus-primary">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Any additional information about this user"
          className="focus-primary"
        />
      </div>
    </div>
  );
};

export default UserFormFields;
