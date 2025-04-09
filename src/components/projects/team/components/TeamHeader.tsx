
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from 'lucide-react';

interface TeamHeaderProps {
  membersCount: number;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
  onAddMember: () => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({
  membersCount,
  isRefreshing,
  onRefresh,
  onAddMember
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">Team</h2>
        <p className="text-muted-foreground">
          {membersCount} {membersCount === 1 ? 'member' : 'members'} on this project
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          disabled={isRefreshing}
          onClick={onRefresh}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button 
          onClick={onAddMember}
          size="sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>
    </div>
  );
};

export default TeamHeader;
