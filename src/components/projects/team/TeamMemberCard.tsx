
import React from 'react';
import { Trash2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamMember } from './types';
import { TeamMemberAvatar, TeamMemberInfo, RoleBadge } from './ui';

interface TeamMemberCardProps {
  member: TeamMember;
  onRemove?: (id: string | number) => void;
  onMakeManager?: (id: string | number) => void;
  isRemoving?: boolean;
  isUpdating?: boolean;
  isProjectManager?: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  onRemove,
  onMakeManager,
  isRemoving = false,
  isUpdating = false,
  isProjectManager = false
}) => {
  // Check if this member is already a project manager
  const isManager = 
    member.role?.toLowerCase() === 'project manager' || 
    member.role?.toLowerCase() === 'project-manager' || 
    member.role?.toLowerCase() === 'project_manager';
  
  // Make sure we have valid data
  const displayName = member.name || 'Team Member';
  const displayRole = member.role || 'Member';
  
  const handleRemove = () => {
    if (onRemove) {
      onRemove(member.id);
    }
  };
  
  const handleMakeManager = () => {
    if (onMakeManager) {
      onMakeManager(member.id);
    }
  };
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <TeamMemberAvatar name={displayName} />
          <TeamMemberInfo 
            name={displayName} 
            role={displayRole}
            isManager={isManager}
          />
        </div>
        
        <RoleBadge role={displayRole} />
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        {!isManager && onMakeManager && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMakeManager}
            disabled={isUpdating}
            className="text-xs"
          >
            <Crown className="h-3.5 w-3.5 mr-1" />
            Make Manager
          </Button>
        )}
        
        {onRemove && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-xs"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
