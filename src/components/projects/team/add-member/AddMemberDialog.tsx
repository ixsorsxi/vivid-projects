
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { useSystemUsers } from '@/hooks/project-form/useSystemUsers';
import { SystemUser } from '../types';
import UserSelector from '../user-select/UserSelector';
import RoleSelector from '../role-select/RoleSelector';
import { debugLog, debugError } from '@/utils/debugLogger';
import { toast } from '@/components/ui/toast-wrapper';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  onAddMember?: (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }) => Promise<boolean>;
  isSubmitting?: boolean;
}

/**
 * Dialog component for adding new members to a project team
 * Completely redesigned for better UX and validation
 */
const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember,
  isSubmitting: externalIsSubmitting = false
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'users' | 'email'>('users');

  // Form state
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [internalIsSubmitting, setInternalIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  const { users, isLoading } = useSystemUsers();

  // Combined submission state
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  // Validation
  const validateForm = (): boolean => {
    setError(null);

    if (activeTab === 'users') {
      if (!selectedUser) {
        setError('Please select a user to add to the project');
        return false;
      }
    } else {
      if (!inviteEmail) {
        setError('Please enter an email address');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inviteEmail)) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    if (!selectedRole) {
      setError('Please select a role for this team member');
      return false;
    }

    if (!projectId) {
      setError('Project ID is missing');
      return false;
    }

    return true;
  };

  // Close and reset
  const handleClose = () => {
    setSelectedUser(null);
    setSelectedRole('');
    setInviteEmail('');
    setError(null);
    setActiveTab('users');
    onOpenChange(false);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !onAddMember) {
      return;
    }

    setInternalIsSubmitting(true);

    try {
      debugLog('AddMemberDialog', 'Submitting form:', { activeTab, selectedUser, inviteEmail, selectedRole });

      let memberData;
      if (activeTab === 'users' && selectedUser) {
        memberData = {
          name: selectedUser.name,
          role: selectedRole,
          email: selectedUser.email,
          user_id: selectedUser.id ? String(selectedUser.id) : undefined
        };
      } else if (activeTab === 'email' && inviteEmail) {
        memberData = {
          name: inviteEmail.split('@')[0],
          role: selectedRole,
          email: inviteEmail
        };
      } else {
        setError('Invalid form data');
        return;
      }

      const success = await onAddMember(memberData);
      
      if (success) {
        toast.success('Team member added', {
          description: `${memberData.name} has been added to the project team`
        });
        handleClose();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add team member';
      setError(errorMessage);
      debugError('AddMemberDialog', 'Error adding member:', error);
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  // Form validity check
  const isFormValid = activeTab === 'users' 
    ? (!!selectedUser && !!selectedRole)
    : (!!inviteEmail && !!selectedRole);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isSubmitting && (isOpen ? onOpenChange(true) : handleClose())}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Add Team Member</h2>
              <p className="text-sm text-muted-foreground">
                Add existing users or invite new members via email
              </p>
              {error && (
                <div className="mt-2 text-sm p-2 border rounded bg-destructive/10 text-destructive border-destructive/20">
                  {error}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'users' | 'email')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users" disabled={isSubmitting}>
                  Existing Users
                </TabsTrigger>
                <TabsTrigger value="email" disabled={isSubmitting}>
                  Email Invite
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Tab content */}
            {activeTab === 'users' ? (
              <UserSelector 
                users={users}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
                isLoading={isLoading}
                disabled={isSubmitting}
              />
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="team.member@example.com"
                      className="pl-9"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    An invitation will be sent to this email address
                  </p>
                </div>
              </div>
            )}

            {/* Role Selector (always visible) */}
            <RoleSelector
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              disabled={isSubmitting}
              required={true}
            />

            {/* Footer */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
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
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
