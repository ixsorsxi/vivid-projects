
import React from 'react';
import { TeamMember } from '@/api/projects/modules/team/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserX } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
      <div className="text-center py-8">
        <p className="text-muted-foreground">No team members found for this project.</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('manager') || roleLower.includes('admin')) return 'default';
    if (roleLower.includes('lead')) return 'secondary';
    return 'outline';
  };

  const formatRoleDisplay = (role: string) => {
    return role
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-4">
      {teamMembers.map((member) => (
        <div 
          key={member.id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{member.name}</h3>
              <Badge variant={getRoleBadgeVariant(member.role)}>
                {formatRoleDisplay(member.role)}
              </Badge>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <UserX className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove {member.name} from the project team.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemoveMember(member.id.toString())}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
};

export default TeamMembersList;
