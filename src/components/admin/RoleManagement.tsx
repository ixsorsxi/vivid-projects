import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/auth';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface CustomRole {
  id: string;
  name: string;
  base_type: 'admin' | 'manager' | 'user';
  created_at?: string;
}

interface Permission {
  id: string;
  role_id: string;
  permission: string;
  enabled: boolean;
}

const PERMISSION_GROUPS = [
  {
    name: 'User Management',
    permissions: [
      { id: 'manage_users', label: 'Manage Users' },
      { id: 'view_users', label: 'View Users' },
      { id: 'create_users', label: 'Create Users' },
    ]
  },
  {
    name: 'Project Management',
    permissions: [
      { id: 'create_projects', label: 'Create Projects' },
      { id: 'view_all_projects', label: 'View All Projects' },
      { id: 'edit_all_projects', label: 'Edit All Projects' },
      { id: 'view_team_projects', label: 'View Team Projects' },
      { id: 'edit_team_projects', label: 'Edit Team Projects' },
      { id: 'view_own_projects', label: 'View Own Projects' },
      { id: 'edit_own_projects', label: 'Edit Own Projects' },
    ]
  },
  {
    name: 'Task Management',
    permissions: [
      { id: 'create_tasks', label: 'Create Tasks' },
      { id: 'assign_tasks', label: 'Assign Tasks' },
      { id: 'view_all_tasks', label: 'View All Tasks' },
      { id: 'edit_all_tasks', label: 'Edit All Tasks' },
      { id: 'edit_own_tasks', label: 'Edit Own Tasks' },
    ]
  },
  {
    name: 'Role Management',
    permissions: [
      { id: 'create_custom_roles', label: 'Create Custom Roles' },
      { id: 'edit_roles', label: 'Edit Roles' },
    ]
  }
];

const RoleManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [activeTab, setActiveTab] = useState('roles');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleBaseType, setNewRoleBaseType] = useState<'admin' | 'manager' | 'user'>('user');
  const [rolePermissions, setRolePermissions] = useState<Record<string, boolean>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_roles')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching roles:', error);
        toast.error('Failed to load roles');
        return;
      }
      
      const formattedRoles: CustomRole[] = (data || []).map(role => ({
        id: role.id,
        name: role.name,
        base_type: role.base_type
      }));
      
      setRoles(formattedRoles);
      if (formattedRoles.length > 0) {
        setSelectedRole(formattedRoles[0]);
        fetchRolePermissions(formattedRoles[0].id);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('An error occurred while fetching roles');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRolePermissions = async (roleId: string) => {
    try {
      const { data, error } = await supabase
        .from('system_role_permissions')
        .select('*')
        .eq('role_id', roleId);
      
      if (error) {
        console.error('Error fetching role permissions:', error);
        toast.error('Failed to load role permissions');
        return;
      }
      
      const permissionsMap: Record<string, boolean> = {};
      
      PERMISSION_GROUPS.forEach(group => {
        group.permissions.forEach(perm => {
          permissionsMap[perm.id] = false;
        });
      });
      
      (data || []).forEach(permission => {
        permissionsMap[permission.permission] = permission.enabled;
      });
      
      setRolePermissions(permissionsMap);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const handleRoleSelect = (role: CustomRole) => {
    setSelectedRole(role);
    fetchRolePermissions(role.id);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      [permissionId]: checked
    }));
  };

  const saveRolePermissions = async () => {
    if (!selectedRole) return;
    
    setIsSaving(true);
    
    try {
      const permissionsToSave = Object.entries(rolePermissions).map(([permission, enabled]) => ({
        role_id: selectedRole.id,
        permission,
        enabled
      }));
      
      const { error: deleteError } = await supabase
        .from('system_role_permissions')
        .delete()
        .eq('role_id', selectedRole.id);
      
      if (deleteError) {
        console.error('Error deleting existing permissions:', deleteError);
        toast.error('Failed to update role permissions');
        return;
      }
      
      const { error: insertError } = await supabase
        .from('system_role_permissions')
        .insert(permissionsToSave);
      
      if (insertError) {
        console.error('Error inserting permissions:', insertError);
        toast.error('Failed to update role permissions');
        return;
      }
      
      toast.success('Role permissions updated successfully');
    } catch (error) {
      console.error('Error saving role permissions:', error);
      toast.error('An error occurred while updating role permissions');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error('Role name is required');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('system_roles')
        .insert({
          name: newRoleName.trim(),
          base_type: newRoleBaseType,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating role:', error);
        toast.error('Failed to create role');
        return;
      }
      
      const newRole: CustomRole = {
        id: data.id,
        name: data.name,
        base_type: data.base_type
      };
      
      toast.success('Role created successfully');
      setRoles(prev => [...prev, newRole]);
      setSelectedRole(newRole);
      fetchRolePermissions(newRole.id);
      setIsRoleDialogOpen(false);
      setNewRoleName('');
      setNewRoleBaseType('user');
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('An error occurred while creating the role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole || !newRoleName.trim()) return;
    
    setIsSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('system_roles')
        .update({
          name: newRoleName.trim(),
          base_type: newRoleBaseType,
        })
        .eq('id', selectedRole.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating role:', error);
        toast.error('Failed to update role');
        return;
      }
      
      const updatedRole: CustomRole = {
        id: data.id,
        name: data.name,
        base_type: data.base_type
      };
      
      toast.success('Role updated successfully');
      setRoles(prev => prev.map(role => role.id === updatedRole.id ? updatedRole : role));
      setSelectedRole(updatedRole);
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('An error occurred while updating the role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole || ['Admin', 'Manager', 'User'].includes(selectedRole.name)) {
      toast.error('Cannot delete default roles');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete the role "${selectedRole.name}"?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('system_roles')
        .delete()
        .eq('id', selectedRole.id);
      
      if (error) {
        console.error('Error deleting role:', error);
        toast.error('Failed to delete role');
        return;
      }
      
      toast.success('Role deleted successfully');
      setRoles(prev => prev.filter(role => role.id !== selectedRole.id));
      setSelectedRole(roles.length > 1 ? roles.filter(r => r.id !== selectedRole.id)[0] : null);
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('An error occurred while deleting the role');
    }
  };

  const openEditDialog = () => {
    if (!selectedRole) return;
    
    setNewRoleName(selectedRole.name);
    setNewRoleBaseType(selectedRole.base_type);
    setIsEditing(true);
    setIsRoleDialogOpen(true);
  };

  const openCreateDialog = () => {
    setNewRoleName('');
    setNewRoleBaseType('user');
    setIsEditing(false);
    setIsRoleDialogOpen(true);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>You do not have permission to access this section.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>
            Create and manage roles with different permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Available Roles</h3>
                <Button onClick={openCreateDialog} disabled={isLoading}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Role
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  <div className="col-span-full text-center py-4">Loading roles...</div>
                ) : roles.length === 0 ? (
                  <div className="col-span-full text-center py-4">No roles found</div>
                ) : (
                  roles.map(role => (
                    <Card 
                      key={role.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedRole?.id === role.id ? 'border-primary' : ''
                      }`}
                      onClick={() => handleRoleSelect(role)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{role.name}</CardTitle>
                        <CardDescription>Base type: {role.base_type}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2 flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoleSelect(role);
                            openEditDialog();
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoleSelect(role);
                            handleDeleteRole();
                          }}
                          disabled={['Admin', 'Manager', 'User'].includes(role.name)}
                        >
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="permissions">
              {!selectedRole ? (
                <div className="text-center py-8">Select a role to manage permissions</div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">
                      Permissions for <span className="font-semibold">{selectedRole.name}</span>
                    </h3>
                    <Button 
                      onClick={saveRolePermissions} 
                      disabled={isSaving || !selectedRole}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Permissions'}
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      {PERMISSION_GROUPS.map(group => (
                        <div key={group.name} className="space-y-2">
                          <h4 className="font-medium border-b pb-1">{group.name}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
                            {group.permissions.map(permission => (
                              <div key={permission.id} className="flex items-center gap-2 py-1">
                                <Checkbox 
                                  id={permission.id} 
                                  checked={rolePermissions[permission.id] || false}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(permission.id, checked === true)
                                  }
                                  disabled={selectedRole.base_type === 'admin'}
                                />
                                <Label 
                                  htmlFor={permission.id}
                                  className={selectedRole.base_type === 'admin' ? 'opacity-50' : ''}
                                >
                                  {permission.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {selectedRole.base_type === 'admin' && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
                      <p>Admin roles automatically have all permissions. Individual permissions cannot be modified.</p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Modify the role details below.' 
                : 'Enter the details for the new role.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="base-type">Base Type</Label>
              <Select
                value={newRoleBaseType}
                onValueChange={(value: 'admin' | 'manager' | 'user') => setNewRoleBaseType(value)}
              >
                <SelectTrigger id="base-type">
                  <SelectValue placeholder="Select base type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Base type determines the default permissions and capabilities of the role.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={isEditing ? handleUpdateRole : handleCreateRole}
              disabled={isSaving || !newRoleName.trim()}
            >
              {isSaving ? 'Saving...' : isEditing ? 'Update Role' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleManagement;
