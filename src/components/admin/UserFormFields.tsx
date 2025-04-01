
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UserFormData, CustomRole } from './hooks/useUserDialogState';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

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
  // Filter roles by type for better organization
  const adminRoles = customRoles.filter(role => role.base_type === 'admin');
  const managerRoles = customRoles.filter(role => role.base_type === 'manager');
  const userRoles = customRoles.filter(role => role.base_type === 'user');
  const otherRoles = customRoles.filter(role => 
    role.base_type !== 'admin' && role.base_type !== 'manager' && role.base_type !== 'user'
  );

  return (
    <div className="grid gap-6 py-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Basic Information</h3>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john.doe@example.com"
              required
              disabled={mode === 'edit'}
            />
            {mode === 'edit' && (
              <p className="text-xs text-muted-foreground mt-1">
                Email addresses cannot be changed after account creation.
              </p>
            )}
          </div>
          
          {mode === 'add' && (
            <div className="grid gap-2">
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter secure password"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 6 characters long.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Role & Permissions</h3>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="role">Base Role <span className="text-red-500">*</span></Label>
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
            <Label htmlFor="custom-role">Custom Role</Label>
            {isLoadingRoles ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={formData.customRoleId || ''}
                onValueChange={handleCustomRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select custom role (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-custom-role">No custom role</SelectItem>
                  
                  {adminRoles.length > 0 && (
                    <>
                      <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Admin Roles</p>
                      {adminRoles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </>
                  )}
                  
                  {managerRoles.length > 0 && (
                    <>
                      <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Manager Roles</p>
                      {managerRoles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </>
                  )}
                  
                  {userRoles.length > 0 && (
                    <>
                      <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">User Roles</p>
                      {userRoles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </>
                  )}
                  
                  {otherRoles.length > 0 && (
                    <>
                      <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Other Roles</p>
                      {otherRoles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Custom roles provide more fine-grained access control.
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
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Information</h3>
        
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes (Internal)</Label>
          <Textarea
            id="notes"
            placeholder="Add any notes about this user (not visible to the user)"
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </div>
      
      {mode === 'add' && (
        <Alert className="bg-muted border-muted-foreground/20 text-sm mt-4">
          <Info className="h-4 w-4 mr-2 text-blue-500" />
          <AlertDescription>
            After creation, the user will receive an email to confirm their account before they can log in.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UserFormFields;
