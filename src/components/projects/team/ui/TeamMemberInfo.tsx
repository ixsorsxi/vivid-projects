
import React from 'react';
import { Crown } from 'lucide-react';

interface TeamMemberInfoProps {
  name: string;
  role?: string;
  isManager?: boolean;
}

const TeamMemberInfo: React.FC<TeamMemberInfoProps> = ({ 
  name, 
  role, 
  isManager = false 
}) => {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center gap-1">
        <span className="font-medium text-sm">{name}</span>
        {isManager && <Crown className="h-3.5 w-3.5 text-yellow-500" />}
      </div>
      {role && <span className="text-xs text-muted-foreground">{role}</span>}
    </div>
  );
};

export default TeamMemberInfo;
