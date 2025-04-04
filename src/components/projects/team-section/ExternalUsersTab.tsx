
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, UserPlus } from 'lucide-react';

interface ExternalUsersTabProps {
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteRole: string;
  setInviteRole: (role: string) => void;
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
  // Available project roles (not system roles)
  const projectRoles = [
    { value: 'Developer', label: 'Developer' },
    { value: 'Designer', label: 'Designer' },
    { value: 'QA Tester', label: 'QA Tester' },
    { value: 'Business Analyst', label: 'Business Analyst' },
    { value: 'Client Stakeholder', label: 'Client Stakeholder' },
    { value: 'Observer', label: 'Observer' }
  ];

  return (
    <Card className="p-4 space-y-4">
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
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleInviteExternal}
          disabled={!inviteEmail || !inviteRole || isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending Invite...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Send Invite</span>
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default ExternalUsersTab;
