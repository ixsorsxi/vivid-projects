
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ExternalInviteForm from './ExternalInviteForm';

interface ExternalUsersTabProps {
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteRole: string;
  setInviteRole: (role: string) => void;
  handleInviteExternal: () => void;
}

const ExternalUsersTab: React.FC<ExternalUsersTabProps> = ({
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  handleInviteExternal
}) => {
  return (
    <div className="space-y-4">
      <ExternalInviteForm 
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteRole={inviteRole}
        setInviteRole={setInviteRole}
      />
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={handleInviteExternal}
          disabled={!inviteEmail || !inviteRole}
          className="gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Invite Team Member
        </Button>
      </div>
    </div>
  );
};

export default ExternalUsersTab;
