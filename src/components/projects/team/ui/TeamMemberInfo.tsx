
import React from 'react';
import { RoleBadge } from './RoleBadge';
import { User, ShieldCheck } from 'lucide-react';

interface TeamMemberInfoProps {
  name: string;
  role: string;
  isManager?: boolean;
}

export const TeamMemberInfo: React.FC<TeamMemberInfoProps> = ({ 
  name, 
  role,
  isManager = false
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-2">
        <div className="font-medium text-base">{name}</div>
        {isManager && (
          <div className="flex items-center text-amber-500 dark:text-amber-400" title="Project Manager">
            <ShieldCheck size={14} className="mr-1" />
            <span className="text-xs">Manager</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <div className="text-sm text-muted-foreground">{role}</div>
      </div>
      
      <div className="text-xs text-muted-foreground flex items-center mt-1">
        <User size={12} className="mr-1 opacity-70" />
        <span>Team Member</span>
      </div>
    </div>
  );
};

export default TeamMemberInfo;
