
import React from 'react';
import { TeamMember } from '../types';
import { TeamMemberAvatar, TeamMemberInfo, RoleBadge } from '../ui';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface TeamGridProps {
  members: TeamMember[];
  onRemove: (id: string | number) => void;
  isRemoving: string | null;
}

const TeamGrid: React.FC<TeamGridProps> = ({ members, onRemove, isRemoving }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {members.length > 0 ? (
        members.map((member) => (
          <div
            key={member.id}
            className="flex items-start p-4 rounded-lg border bg-card shadow-sm"
          >
            <TeamMemberAvatar name={member.name} />
            
            <div className="ml-3 flex-1 min-w-0">
              <TeamMemberInfo name={member.name} role={member.role} />
              <RoleBadge role={member.role} />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(member.id)}
              disabled={isRemoving === String(member.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove {member.name}</span>
            </Button>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No team members yet</p>
        </div>
      )}
    </div>
  );
};

export default TeamGrid;
