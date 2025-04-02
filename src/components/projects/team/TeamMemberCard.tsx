
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
    <div className="relative flex items-center p-4 border rounded-lg bg-card/40 hover:bg-accent/50 transition-colors shadow-sm">
      <TeamMemberAvatar 
        name={member.name || 'Team Member'} 
        role={member.role}
        size="md" 
        showStatus={true}
        className="mr-4"
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
        className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
        onClick={handleRemove}
        disabled={isRemoving}
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserX className="h-4 w-4" />
        )}
        <span className="sr-only">Remove team member</span>
      </Button>
    </div>
  );
};

export default TeamMemberCard;
