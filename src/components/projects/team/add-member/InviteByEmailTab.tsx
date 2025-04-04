
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { projectRoles } from '../constants';

interface InviteByEmailTabProps {
  inviteEmail: string;
  inviteRole: string;
  onEmailChange: (email: string) => void;
  onRoleChange: (role: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const InviteByEmailTab: React.FC<InviteByEmailTabProps> = ({
  inviteEmail,
  inviteRole,
  onEmailChange,
  onRoleChange,
  onCancel,
  onSubmit,
  isSubmitting = false
}) => {
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
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-1">
          Project Role
        </label>
        <Select value={inviteRole} onValueChange={onRoleChange}>
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
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
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
