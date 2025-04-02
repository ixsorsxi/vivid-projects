
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Consistent role options across the application
const ROLE_OPTIONS = [
  'Project Manager',
  'Developer',
  'Designer',
  'QA Engineer',
  'Business Analyst',
  'Product Owner',
  'Team Member'
];

interface InviteByEmailTabProps {
  inviteEmail: string;
  inviteRole: string;
  onEmailChange: (email: string) => void;
  onRoleChange: (role: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const InviteByEmailTab: React.FC<InviteByEmailTabProps> = ({
  inviteEmail,
  inviteRole,
  onEmailChange,
  onRoleChange,
  onCancel,
  onSubmit
}) => {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={inviteEmail}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={inviteRole} onValueChange={onRoleChange}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit} 
          disabled={!inviteEmail}
        >
          Invite
        </Button>
      </div>
    </>
  );
};

export default InviteByEmailTab;
