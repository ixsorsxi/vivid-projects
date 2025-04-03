
import React from 'react';

interface TeamMemberInfoProps {
  name: string;
  role: string;
  isManager?: boolean;
}

const TeamMemberInfo: React.FC<TeamMemberInfoProps> = ({ 
  name, 
  role,
  isManager = false
}) => {
  return (
    <div>
      <h4 className="font-medium">
        {name}
        {isManager && (
          <span className="ml-1 text-xs text-primary font-normal">(Manager)</span>
        )}
      </h4>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  );
};

export default TeamMemberInfo;
