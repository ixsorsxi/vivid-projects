
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TeamMember } from '@/api/projects/modules/team/types';

interface TeamMembersListProps {
  teamMembers: TeamMember[];
  onRemoveMember: (id: string) => void;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ teamMembers, onRemoveMember }) => {
  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No team members yet. Add team members to collaborate on this project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teamMembers.map(member => (
        <div 
          key={member.id} 
          className="flex items-center justify-between p-3 rounded-md border"
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              {member.name?.charAt(0) || 'T'}
            </div>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{member.role || 'Team Member'}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700"
            onClick={() => onRemoveMember(member.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TeamMembersList;
