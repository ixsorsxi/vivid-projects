
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
  // Format the name for display - ensure we always use the actual name
  const displayName = name && name !== role ? name : 'Team Member';
  
  return (
    <div>
      <h4 className="font-medium">
        {displayName}
        {isManager && (
          <span className="ml-1 text-xs text-primary font-normal">(Manager)</span>
        )}
      </h4>
      <p className="text-sm text-muted-foreground capitalize">
        {role?.replace(/-/g, ' ')}
      </p>
    </div>
  );
};

export default TeamMemberInfo;
