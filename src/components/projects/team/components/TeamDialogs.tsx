
import React from 'react';
import AddMemberDialog from '../add-member';

interface TeamDialogsProps {
  isAddMemberOpen: boolean;
  setIsAddMemberOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId?: string;
  onAddMember: (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => Promise<boolean>;
}

/**
 * Component to manage all team-related dialogs
 */
const TeamDialogs: React.FC<TeamDialogsProps> = ({
  isAddMemberOpen,
  setIsAddMemberOpen,
  projectId,
  onAddMember
}) => {
  return (
    <>
      <AddMemberDialog 
        open={isAddMemberOpen} 
        onOpenChange={setIsAddMemberOpen}
        projectId={projectId}
        onAddMember={onAddMember}
      />
    </>
  );
};

export default TeamDialogs;
