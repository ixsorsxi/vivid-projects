
import React from 'react';
import { TeamMember } from '@/api/projects/modules/team/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar.custom';

interface TeamMembersListProps {
  teamMembers: TeamMember[];
  onRemoveMember: (id: string) => Promise<boolean>;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ 
  teamMembers, 
  onRemoveMember 
}) => {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No team members found for this project.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add team members using the "Add Member" button above.
        </p>
      </div>
    );
  }

  const handleRemove = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the team?`)) {
      await onRemoveMember(id);
    }
  };

  // Helper function to format role for display
  const formatRoleDisplay = (role: string) => {
    if (!role) return 'Team Member';
    
    return role
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-3">
      {teamMembers.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-3 rounded-md border">
          <div className="flex items-center gap-3">
            <Avatar 
              name={member.name || 'Team Member'}
              className="h-8 w-8 bg-primary/10 text-primary"
            />
            <div>
              <p className="font-medium">{member.name || 'Team Member'}</p>
              <p className="text-xs text-muted-foreground">
                {member.user_id ? `User ID: ${member.user_id.slice(0, 8)}...` : 'No user ID'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{formatRoleDisplay(member.role || 'team_member')}</Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={() => handleRemove(member.id, member.name || 'Team Member')}
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
