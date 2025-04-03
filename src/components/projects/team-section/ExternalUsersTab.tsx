
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

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

interface ExternalUsersTabProps {
  inviteEmail: string;
  setInviteEmail: (value: string) => void;
  inviteRole: string;
  setInviteRole: (value: string) => void;
  handleInviteExternal: () => void;
  isSubmitting?: boolean;
}

const ExternalUsersTab: React.FC<ExternalUsersTabProps> = ({
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  handleInviteExternal,
  isSubmitting = false
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="inviteEmail">Email Address</Label>
        <Input
          id="inviteEmail"
          placeholder="user@example.com"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="inviteRole">Role</Label>
        <Select value={inviteRole} onValueChange={setInviteRole} disabled={isSubmitting}>
          <SelectTrigger id="inviteRole">
            <SelectValue placeholder="Select role" />
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
      
      <Button 
        onClick={handleInviteExternal} 
        disabled={!inviteEmail || !inviteRole || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Inviting...
          </>
        ) : (
          "Invite External User"
        )}
      </Button>
    </div>
  );
};

export default ExternalUsersTab;
