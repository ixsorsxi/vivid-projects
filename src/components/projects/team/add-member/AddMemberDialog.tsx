
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSelector from '../user-select/UserSelector';
import RoleSelector from '../role-select/RoleSelector';
import { SystemUser } from '../types';
import { debugLog, debugError } from '@/utils/debugLogger';
import { toast } from '@/components/ui/toast-wrapper';
import { Form } from '@/components/ui/form';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddMember: (member: { 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }) => Promise<boolean>;
  isSubmitting?: boolean;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember,
  isSubmitting = false
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<string>('user');
  
  // Form state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('team_member');
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // User selection state
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      // Only fetch users when dialog opens
      fetchSystemUsers();
    } else {
      // Reset form when dialog closes
      resetForm();
    }
  }, [open]);
  
  // Validate form based on active tab
  useEffect(() => {
    if (activeTab === 'user') {
      setIsFormValid(!!selectedUser && !!role);
    } else {
      setIsFormValid(!!name && !!role);
    }
  }, [activeTab, name, role, selectedUser]);

  // Reset the form to initial state
  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('team_member');
    setError(null);
    setActiveTab('user');
    setSelectedUser(null);
  };
  
  // Fetch system users
  const fetchSystemUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, role')
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      
      const users: SystemUser[] = data.map(user => ({
        id: user.id,
        name: user.full_name || user.username || 'Unnamed User',
        email: user.username,
        role: user.role || 'user',
        avatar: user.avatar_url
      }));
      
      debugLog('AddMemberDialog', 'Fetched system users:', users);
      setSystemUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoadingUsers(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      let memberData;
      
      if (activeTab === 'user') {
        if (!selectedUser) {
          setError('Please select a user');
          return;
        }
        
        memberData = {
          name: selectedUser.name,
          role,
          email: selectedUser.email,
          user_id: selectedUser.id
        };
      } else {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        
        memberData = {
          name,
          role,
          email: email || undefined
        };
      }
      
      debugLog('AddMemberDialog', 'Submitting member data:', memberData);
      
      const success = await onAddMember(memberData);
      
      if (success) {
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="user">Add Existing User</TabsTrigger>
              <TabsTrigger value="external">Add External Member</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="space-y-4">
              <UserSelector
                users={systemUsers}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
                isLoading={isLoadingUsers}
                disabled={isSubmitting}
              />
              
              <RoleSelector
                selectedRole={role}
                onRoleChange={setRole}
                disabled={isSubmitting}
                className="mt-4"
              />
            </TabsContent>
            
            <TabsContent value="external" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="mb-2 block">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter team member name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="mb-2 block">
                    Email (optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be used for invitations but won't create a user account
                  </p>
                </div>
                
                <RoleSelector
                  selectedRole={role}
                  onRoleChange={setRole}
                  disabled={isSubmitting}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
