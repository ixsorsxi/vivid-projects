
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserX } from 'lucide-react';
import { TeamMember } from './types';
import { TeamMemberAvatar, TeamMemberInfo } from './ui';

interface TeamMemberCardProps {
  member: TeamMember;
  onRemove: (id: string | number) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onRemove }) => {
  const handleRemove = () => {
    if (member.id) {
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
      
      <Button variant="ghost" size="sm" className="shrink-0" onClick={handleRemove}>
        <UserX className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TeamMemberCard;
