
import React from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamHeaderProps {
  memberCount: number;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onAddMember?: () => void;
  projectManagerName?: string | null;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({
  memberCount,
  isRefreshing = false,
  onRefresh,
  onAddMember,
  projectManagerName
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Project Team</h2>
        <div className="text-sm text-muted-foreground">
          <span>{memberCount} {memberCount === 1 ? 'member' : 'members'} on this project</span>
          {projectManagerName && (
            <span className="ml-2 text-primary">• Managed by {projectManagerName}</span>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button
          size="sm"
          onClick={onAddMember}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>
    </div>
  );
};

export default TeamHeader;
