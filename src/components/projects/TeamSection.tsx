
import React from 'react';
import { TeamMember } from '@/lib/types/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar.custom';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface TeamSectionProps {
  projectId: string;
  members: TeamMember[];
  onAddMember?: () => void;
  isLoading?: boolean;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  projectId,
  members,
  onAddMember,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Project Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-md border">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl">Project Team</CardTitle>
        {onAddMember && (
          <Button variant="default" size="sm" onClick={onAddMember}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add Member
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {members && members.length > 0 ? (
          <div className="space-y-3">
            {members.map((member) => (
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-lg">
            <p>No team members assigned to this project yet.</p>
            <p className="text-sm mt-2">Add team members to collaborate on this project.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamSection;
