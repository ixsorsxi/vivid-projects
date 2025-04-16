
import React from 'react';
import { TeamMember } from '@/lib/types/common';
import { Avatar } from '@/components/ui/avatar.custom';
import { MoreHorizontal, Mail, UserMinus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMembersListProps {
  members: TeamMember[];
  projectId: string;
  onRemoveMember?: (memberId: string) => void;
  onMakeManager?: (memberId: string) => void;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({
  members,
  projectId,
  onRemoveMember,
  onMakeManager
}) => {
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-lg">
        <p>No team members assigned to this project yet.</p>
        <p className="text-sm mt-2">Add team members to collaborate on this project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map(member => (
        <div
          key={member.id}
          className="flex items-center justify-between p-3 rounded-md border"
        >
          <div className="flex items-center space-x-3">
            <Avatar name={member.name} />
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role || 'Team Member'}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(`mailto:${member.email || ''}`)}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Contact</span>
              </DropdownMenuItem>
              
              {onMakeManager && (
                <DropdownMenuItem onClick={() => onMakeManager(member.id)}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>Make Project Manager</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {onRemoveMember && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onRemoveMember(member.id)}
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  <span>Remove from Project</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

export default TeamMembersList;
