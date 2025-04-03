
import React from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamHeaderProps {
  memberCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onAddMember: () => void;
  projectManagerName?: string | null;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({
  memberCount,
  isRefreshing,
  onRefresh,
  onAddMember,
  projectManagerName
}) => {
  // Format project manager name for display
  const formattedManagerName = projectManagerName 
    ? projectManagerName 
    : 'Not Assigned';
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold">Project Team</h2>
        <p className="text-muted-foreground">
          {memberCount} member{memberCount !== 1 ? 's' : ''} on this project
          {projectManagerName && (
            <span className="ml-1">• Project Manager: {formattedManagerName}</span>
          )}
        </p>
      </div>
      
      <div className="mt-4 sm:mt-0 flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button size="sm" onClick={onAddMember}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>
    </div>
  );
};

export default TeamHeader;
