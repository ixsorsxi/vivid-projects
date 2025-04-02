
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserX, Loader2 } from 'lucide-react';
import { TeamMember } from './types';
import { TeamMemberAvatar, TeamMemberInfo } from './ui';

interface TeamMemberCardProps {
  member: TeamMember;
  onRemove: (id: string | number) => void;
  isRemoving?: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onRemove, isRemoving = false }) => {
  const handleRemove = () => {
    if (member.id && !isRemoving) {
      onRemove(member.id);
    }
  };

  // Check if the member is a project manager
  const isManager = member.role?.toLowerCase().includes('manager') || false;

  return (
    <div className="relative flex items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <TeamMemberAvatar 
        name={member.name || 'Team Member'} 
        role={member.role}
        size="md" 
        showStatus={true}
        className="mr-3"
      />
      
      <div className="flex-1">
        <TeamMemberInfo 
          name={member.name || 'Team Member'} 
          role={member.role || 'Team Member'}
          isManager={isManager}
        />
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="shrink-0" 
        onClick={handleRemove}
        disabled={isRemoving}
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserX className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default TeamMemberCard;
