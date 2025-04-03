
import React from 'react';
import { TeamMember } from '@/lib/types/common';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TeamMembersSectionProps {
  projectId: string;
  team: TeamMember[];
}

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  projectId,
  team
}) => {
  // In a full implementation, we would have team member management functionality here
  // Currently just displaying the existing team members
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
                <Avatar
                  name={member.name || 'TM'}
                  size="sm"
                >
                </Avatar>
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
        <div className="text-center py-6 text-muted-foreground">
          <p>No team members assigned to this project yet.</p>
          <p className="text-sm">Add team members to collaborate on this project.</p>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground mt-2">
        <p>Note: To add or modify team members, use the Team tab in the main project view.</p>
      </div>
    </div>
  );
};

export default TeamMembersSection;
