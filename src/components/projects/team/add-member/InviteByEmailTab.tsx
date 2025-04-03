
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

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
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={inviteRole} onValueChange={onRoleChange} disabled={isSubmitting}>
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit} 
          disabled={!inviteEmail || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Invite"
          )}
        </Button>
      </div>
    </>
  );
};

export default InviteByEmailTab;
