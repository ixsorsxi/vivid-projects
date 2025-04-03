
import React from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamHeaderProps {
  membersCount: number;
  isRefreshing?: boolean;
  onRefresh: () => void;
  onAddMember: () => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({
  membersCount,
  isRefreshing = false,
  onRefresh,
  onAddMember
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Project Team
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {membersCount} {membersCount === 1 ? 'member' : 'members'} on this project
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button 
          size="sm" 
          onClick={onAddMember}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
        >
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>
    </div>
  );
};

export default TeamHeader;
