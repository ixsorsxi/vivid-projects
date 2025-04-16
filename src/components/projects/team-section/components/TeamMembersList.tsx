
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2, UserPlus, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '../hooks/useProjectTeam';
import { toast } from '@/components/ui/toast-wrapper';
import { Card, CardContent } from '@/components/ui/card';

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
  const handleRemoveMember = async (memberId: string, memberName: string) => {
    try {
      const confirmed = await onRemoveMember(memberId);
      if (confirmed) {
        toast.success(`${memberName} has been removed from the team`, {
          description: "The member no longer has access to this project"
        });
      }
    } catch (error) {
      toast.error("Failed to remove team member", {
        description: "Please try again or contact support if the issue persists"
      });
    }
  };

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <UserPlus className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
        <h3 className="text-lg font-medium mb-1">No team members yet</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
          Add team members to collaborate on this project. They will be able to view and contribute to the project.
        </p>
        <Button variant="outline" className="mt-2" onClick={() => {}}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add first team member
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teamMembers.map((member) => (
        <Card key={member.id} className="overflow-hidden border border-border/70 hover:border-primary/20 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={member.profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {(member.profile?.full_name || 'User').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium">{member.profile?.full_name || 'Unknown User'}</p>
                    {member.role === 'owner' && (
                      <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                        <Shield className="h-3 w-3 mr-1" />
                        Owner
                      </Badge>
                    )}
                    {member.role === 'admin' && (
                      <Badge variant="outline" className="ml-2 bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.role === 'member' ? 'Team Member' : member.role}
                  </p>
                </div>
              </div>
              
              {member.role !== 'owner' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id, member.profile?.full_name || 'This member')}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamMembersList;
