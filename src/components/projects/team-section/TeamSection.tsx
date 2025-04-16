
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeamMember } from '@/lib/types/common';
import { UserPlus } from 'lucide-react';

interface TeamSectionProps {
  teamMembers: TeamMember[];
  projectId: string;
  onAddMember?: () => void;
  onRemoveMember?: (memberId: string) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ 
  teamMembers, 
  projectId,
  onAddMember,
  onRemoveMember 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Team Members</CardTitle>
          {onAddMember && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddMember}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Member</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {teamMembers && teamMembers.length > 0 ? (
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-3 rounded-md border border-border/60"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role || 'Team Member'}</p>
                  </div>
                </div>
                {onRemoveMember && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onRemoveMember(member.id)}
                    className="h-8 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground bg-muted/40 rounded-md">
            <p>No team members added yet</p>
            {onAddMember && (
              <Button variant="link" onClick={onAddMember} className="mt-2">
                Add the first team member
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamSection;
