
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from "lucide-react";

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
      <div className="flex items-center space-x-2">
        <CardTitle>Project Team</CardTitle>
        {!isLoading && !isRetrying && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="h-8 w-8 p-0"
            title="Refresh team members"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button 
        onClick={onAddMember}
        size="sm"
        className="flex items-center gap-1"
        disabled={!hasAccess || isLoading}
      >
        <UserPlus className="h-4 w-4" />
        Add Member
      </Button>
    </CardHeader>
  );
};

export default TeamCardHeader;
