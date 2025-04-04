
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { projectRoles } from '../constants';
import { debugLog } from '@/utils/debugLogger';

interface InviteByEmailTabProps {
  projectId?: string;
  onAddMember?: (member: { name: string; role: string; email?: string; user_id?: string }) => Promise<boolean>;
  isSubmitting?: boolean;
}

const InviteByEmailTab: React.FC<InviteByEmailTabProps> = ({
  onAddMember,
  isSubmitting = false,
  projectId
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Team Member');

  const handleCancel = () => {
    setInviteEmail('');
    setInviteRole('Team Member');
  };

  const handleSubmit = async () => {
    if (!inviteEmail || !inviteRole || !onAddMember) return;
    
    debugLog('InviteByEmailTab', 'Submitting email invite:', inviteEmail, 'with role:', inviteRole);
    
    try {
      const success = await onAddMember({
        name: inviteEmail.split('@')[0],
        role: inviteRole,
        email: inviteEmail
      });
      
      if (success) {
        // Reset form on success
        setInviteEmail('');
        setInviteRole('Team Member');
      }
    } catch (error) {
      console.error('Error inviting by email:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-1">
          Project Role
        </label>
        <Select value={inviteRole} onValueChange={setInviteRole}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
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
          This determines what the user can do within the project
        </p>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!inviteEmail || !inviteRole || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Invite...
            </>
          ) : (
            "Send Invite"
          )}
        </Button>
      </div>
    </div>
  );
};

export default InviteByEmailTab;
