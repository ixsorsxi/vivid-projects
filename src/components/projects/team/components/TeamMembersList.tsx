
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, UserCheck, Trash2 } from 'lucide-react';
import { TeamMember } from '../types';

interface TeamMembersListProps {
  members: TeamMember[];
  isRemoving: boolean;
  isUpdating: boolean;
  onRemove: (id: string) => Promise<boolean>;
  onMakeManager: (id: string) => Promise<boolean>;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({
  members,
  isRemoving,
  isUpdating,
  onRemove,
  onMakeManager
}) => {
  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div 
          key={member.id} 
          className="flex items-center justify-between p-4 bg-card rounded-md border"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{member.name}</div>
              <div className="text-sm text-muted-foreground">{member.role}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {member.role !== 'Project Manager' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMakeManager(member.id)}
                disabled={isUpdating}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Make Manager
              </Button>
            )}
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(member.id)}
              disabled={isRemoving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMembersList;
