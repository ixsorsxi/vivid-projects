
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '../hooks/useProjectTeam';

interface TeamMembersListProps {
  teamMembers: TeamMember[];
  currentProjectId: string;
  onRemoveMember: (memberId: string) => Promise<boolean>;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({
  teamMembers,
  currentProjectId,
  onRemoveMember
}) => {
  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No team members found for this project.</p>
        <p className="text-sm mt-2">Add team members to collaborate on this project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teamMembers.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={member.profile?.avatar_url || undefined} />
              <AvatarFallback>
                {(member.profile?.full_name || 'User').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.profile?.full_name || 'Unknown User'}</p>
              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                {member.user_id}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline">{member.role}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveMember(member.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMembersList;
