
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectRoles } from '../../constants';

interface EmailInviteTabProps {
  onEmailChange: (email: string) => void;
  onRoleChange: (role: string) => void;
  inviteEmail: string;
  selectedRole: string;
}

const EmailInviteTab: React.FC<EmailInviteTabProps> = ({
  onEmailChange,
  onRoleChange,
  inviteEmail,
  selectedRole
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
        <Select value={selectedRole} onValueChange={onRoleChange}>
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
      </div>
    </div>
  );
};

export default EmailInviteTab;
