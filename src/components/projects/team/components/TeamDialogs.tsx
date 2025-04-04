
import React from 'react';
import AddMemberDialog from '../add-member/AddMemberDialog';
import { debugLog } from '@/utils/debugLogger';

interface TeamDialogsProps {
  isAddMemberOpen: boolean;
  setIsAddMemberOpen: (open: boolean) => void;
  projectId?: string;
  onAddMember: (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => Promise<boolean>;
  isAddingMember: boolean;
}

const TeamDialogs: React.FC<TeamDialogsProps> = ({
  isAddMemberOpen,
  setIsAddMemberOpen,
  projectId,
  onAddMember,
  isAddingMember
}) => {
  debugLog('TeamDialogs', `Rendering dialogs for project ID: ${projectId}`);
  
  return (
    <>
      <AddMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        projectId={projectId}
        onAddMember={async (member) => {
          debugLog('TeamDialogs', 'Add member called with:', member);
          return onAddMember(member);
        }}
        isSubmitting={isAddingMember}
      />
    </>
  );
};

export default TeamDialogs;
