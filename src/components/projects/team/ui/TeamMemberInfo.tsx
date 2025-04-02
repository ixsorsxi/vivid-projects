
import React from 'react';
import { RoleBadge } from './RoleBadge';

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
    <div className="flex flex-col">
      <div className="font-medium">{name}</div>
      <div className="flex items-center mt-1">
        <RoleBadge role={role} size="md" />
      </div>
    </div>
  );
};

export default TeamMemberInfo;
