
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from 'lucide-react';
import { RoleSelector } from '@/components/projects/team/ui';

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
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        
        <div>
          <label htmlFor="role" className="text-sm font-medium mb-1.5 block">
            Role
          </label>
          <RoleSelector
            value={inviteRole}
            onChange={setInviteRole}
            disabled={isSubmitting}
          />
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
              <span>Inviting...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Send Invitation</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExternalUsersTab;
