
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectRoles } from '../../constants';

interface EmailInviteTabProps {
  onEmailChange: (email: string) => void;
  onRoleChange: (role: string) => void;
  inviteEmail: string;
  selectedRole: string;
  disabled?: boolean;
}

const EmailInviteTab: React.FC<EmailInviteTabProps> = ({
  onEmailChange,
  onRoleChange,
  inviteEmail,
  selectedRole,
  disabled = false
}) => {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="team.member@example.com"
          value={inviteEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          An invitation will be sent to this email address.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Project Role</Label>
        <Select 
          value={selectedRole} 
          onValueChange={onRoleChange} 
          disabled={disabled}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {projectRoles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          The role determines what actions this person can perform in the project.
        </p>
      </div>
    </div>
  );
};

export default EmailInviteTab;
