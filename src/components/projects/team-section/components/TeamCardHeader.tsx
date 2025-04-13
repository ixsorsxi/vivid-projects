
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCcw } from 'lucide-react';

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
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Project Team</CardTitle>
        <CardDescription>Manage team members and roles</CardDescription>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading || isRetrying}
          title="Refresh team members"
        >
          <RefreshCcw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
        </Button>
        {hasAccess && (
          <Button 
            onClick={onAddMember}
            disabled={isLoading}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        )}
      </div>
    </CardHeader>
  );
};

export default TeamCardHeader;
