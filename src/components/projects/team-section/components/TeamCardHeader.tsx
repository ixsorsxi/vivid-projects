
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from 'lucide-react';

interface TeamCardHeaderProps {
  onAddMember: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isRetrying: boolean;
  hasAccess: boolean;
}

const TeamCardHeader: React.FC<TeamCardHeaderProps> = ({
  onAddMember,
  onRefresh,
  isLoading,
  isRetrying,
  hasAccess
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xl">Project Team</CardTitle>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading || isRetrying}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        {hasAccess && (
          <Button
            variant="default"
            size="sm"
            onClick={onAddMember}
            disabled={isLoading}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Add Member
          </Button>
        )}
      </div>
    </CardHeader>
  );
};

export default TeamCardHeader;
