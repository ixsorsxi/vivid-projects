
import React from 'react';
import { RefreshCw, UserPlus, UserCog } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">Project Team</h2>
        <div className="text-sm text-muted-foreground mt-1">
          {memberCount} {memberCount === 1 ? 'member' : 'members'} on this project
          {projectManagerName && (
            <div className="flex items-center mt-1 text-sm">
              <UserCog className="h-4 w-4 mr-1 text-primary" />
              <span>Project Manager: <span className="font-medium">{projectManagerName}</span></span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        )}
        
        {onAddMember && (
          <Button variant="default" size="sm" onClick={onAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            <span>Add Member</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TeamHeader;
