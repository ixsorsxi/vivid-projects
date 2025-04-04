
import React from 'react';
import { Crown } from 'lucide-react';

interface TeamMemberInfoProps {
  name: string;
  role: string;
  email?: string;
  isManager?: boolean;
}

const TeamMemberInfo: React.FC<TeamMemberInfoProps> = ({
  name,
  role,
  email,
  isManager = false
}) => {
  return (
    <div>
      <div className="flex items-center gap-1">
        <p className="font-medium text-sm">{name}</p>
        {isManager && <Crown className="h-3.5 w-3.5 text-amber-500" />}
      </div>
      {email && (
        <p className="text-xs text-muted-foreground">{email}</p>
      )}
    </div>
  );
};

export default TeamMemberInfo;
