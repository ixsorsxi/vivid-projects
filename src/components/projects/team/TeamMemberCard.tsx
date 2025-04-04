
import React from 'react';
import { MoreVertical, Shield, UserX, UserCog } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar.custom';
import { TeamMember } from './types';
import { RoleBadge } from './ui';

interface TeamMemberCardProps {
  member: TeamMember;
  projectManagerName: string | null;
  onRemove: (id: string) => void;
  onMakeManager: (id: string) => void;
  isRemoving: boolean;
  isUpdating: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  projectManagerName,
  onRemove,
  onMakeManager,
  isRemoving,
  isUpdating
}) => {
  const isManager = 
    member.role === 'Project Manager' || 
    member.role === 'project_manager' || 
    member.role === 'project-manager';
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center space-x-3">
        <Avatar src={member.avatar} name={member.name} size="sm" />
        <div>
          <p className="font-medium">{member.name}</p>
          {member.email && (
            <p className="text-xs text-muted-foreground">{member.email}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end space-y-1">
        <div className="flex items-center space-x-2">
          <RoleBadge role={member.role} size="sm" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isManager && (
                <DropdownMenuItem
                  onClick={() => onMakeManager(member.id)}
                  disabled={isUpdating}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Make Project Manager
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onRemove(member.id)}
                disabled={isRemoving}
                className="text-destructive focus:text-destructive"
              >
                <UserX className="mr-2 h-4 w-4" />
                Remove from Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {member.role_description && (
          <p className="text-xs text-muted-foreground">
            {member.role_description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
