
import React from 'react';
import { TeamMember } from '@/lib/types/common';
import { Badge } from '@/components/ui/badge';

interface TeamMembersSectionProps {
  projectId: string;
  team: TeamMember[];
}

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  projectId,
  team
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Team Members</h3>
      
      {team && team.length > 0 ? (
        <div className="space-y-3">
          {team.map((member: TeamMember) => (
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
                  <p className="text-sm text-muted-foreground">{member.user_id}</p>
                </div>
              </div>
              <Badge variant="secondary">{member.role}</Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-lg">
          <p>No team members assigned to this project yet.</p>
          <p className="text-sm mt-2">Add team members to collaborate on this project.</p>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground mt-4 p-3 border rounded-md bg-muted/10">
        <p>Note: To add or modify team members, use the Team tab in the main project view.</p>
      </div>
    </div>
  );
};

export default TeamMembersSection;
