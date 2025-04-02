
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';

interface TeamHeaderProps {
  memberCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onAddMember: () => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({
  memberCount,
  isRefreshing,
  onRefresh,
  onAddMember
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold">Team Members</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Project team ({memberCount} members)
        </p>
      </div>
      <div className="flex space-x-2">
        {isRefreshing ? (
          <Button size="sm" disabled>
            Refreshing...
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline"
            onClick={onRefresh}
          >
            Refresh
          </Button>
        )}
        <Button 
          size="sm" 
          onClick={onAddMember}
          disabled={isRefreshing}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>
    </div>
  );
};

export default TeamHeader;
