
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, UserPlus } from 'lucide-react';

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
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-semibold">Project Team</h2>
        <p className="text-sm text-muted-foreground">
          {membersCount} {membersCount === 1 ? 'member' : 'members'}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onRefresh()}
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
