
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/toast-wrapper';
import { supabase } from '@/integrations/supabase/client';

interface CustomRole {
  id: string;
  name: string;
  base_type: string;
}

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: {
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
  }) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ isOpen, onClose, onAddUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user' | 'manager'>('user');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [customRoleId, setCustomRoleId] = useState<string>('');
  
  const { createUser, isAdmin } = useAuth();

  const fetchCustomRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const { data, error } = await supabase
        .from('custom_roles')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching custom roles:', error);
        return;
      }
      
      setCustomRoles(data || []);
      
      // Set default role based on selected basic role
      const defaultRole = data?.find(r => r.base_type === role && 
        (r.name === 'Admin' || r.name === 'Manager' || r.name === 'User'));
      
      if (defaultRole) {
        setCustomRoleId(defaultRole.id);
      }
    } catch (error) {
      console.error('Error fetching custom roles:', error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCustomRoles();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error("Unauthorized", {
        description: "Only administrators can create users",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the createUser method from AuthContext
      const success = await createUser(
        email, 
        password, 
        name, 
        role
      );
      
      if (success) {
        // Update the user's custom role if selected
        if (customRoleId) {
          // Find the user's ID by email
          const { data: userData } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', email)
            .maybeSingle();
            
          if (userData?.id) {
            await supabase
              .from('profiles')
              .update({ custom_role_id: customRoleId })
              .eq('id', userData.id);
          }
        }
        
        // Call the onAddUser function to update the UI
        onAddUser({
          name,
          email,
          role,
          status
        });
        
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setRole('user');
        setStatus('active');
        setNotes('');
        setCustomRoleId('');
        onClose();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (value: 'admin' | 'user' | 'manager') => {
    setRole(value);
    
    // Find the default role for this base type
    const defaultRole = customRoles.find(role => role.base_type === value && 
      (role.name === 'Admin' || role.name === 'Manager' || role.name === 'User'));
    
    if (defaultRole) {
      setCustomRoleId(defaultRole.id);
    } else {
      setCustomRoleId('');
    }
  };

  const getBasicRoleFromCustomRole = (roleId: string): 'admin' | 'user' | 'manager' => {
    const role = customRoles.find(r => r.id === roleId);
    if (!role) return 'user';
    
    if (role.base_type === 'admin') return 'admin';
    if (role.base_type === 'manager') return 'manager';
    return 'user';
  };

  const handleCustomRoleChange = (roleId: string) => {
    setCustomRoleId(roleId);
    
    // Update the basic role to match the custom role's base type
    if (roleId) {
      const basicRole = getBasicRoleFromCustomRole(roleId);
      setRole(basicRole);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg border-input">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user account.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="focus-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="focus-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Basic Role</Label>
              <Select value={role} onValueChange={handleRoleChange}>
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
                value={customRoleId} 
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
              <Select value={status} onValueChange={(value: 'active' | 'inactive') => setStatus(value)}>
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information about this user"
                className="focus-primary"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;

