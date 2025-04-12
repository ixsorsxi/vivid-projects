
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RoleBadge from '../ui/RoleBadge';

interface TeamMemberItemProps {
  id: string;
  name: string;
  role: string;
  userId?: string;
  currentUserId?: string | null;
  onRemove: (id: string) => void;
  onMakeManager: (id: string) => void;
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({
  id,
  name,
  role,
  userId,
  currentUserId,
  onRemove,
  onMakeManager
}) => {
  const isManager = 
    role === 'Project Manager' || 
    role === 'project_manager' || 
    role === 'project-manager';

  return (
    <div 
      key={id} 
      className="flex items-center justify-between p-3 rounded-md border"
    >
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <RoleBadge role={role} size="sm" />
        </div>
      </div>
      <div className="flex space-x-2">
        {!isManager && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMakeManager(id)}
            title="Make Project Manager"
          >
            <Shield className="h-4 w-4 text-blue-500" />
          </Button>
        )}
        {userId !== currentUserId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            title="Remove Member"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TeamMemberItem;
