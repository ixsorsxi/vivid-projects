
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface TeamAccessDeniedProps {
  onCheckAccessAgain: () => void;
}

const TeamAccessDenied: React.FC<TeamAccessDeniedProps> = ({ onCheckAccessAgain }) => {
  return (
    <div className="text-center py-6 text-muted-foreground">
      <p>You don't have permission to view team members for this project.</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onCheckAccessAgain}
        className="mt-3"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Check Access Again
      </Button>
    </div>
  );
};

export default TeamAccessDenied;
