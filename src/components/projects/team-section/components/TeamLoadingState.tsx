
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface TeamLoadingStateProps {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

const TeamLoadingState: React.FC<TeamLoadingStateProps> = ({
  isLoading,
  hasError,
  errorMessage,
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-6 flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Loading team members...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>Error loading team members: {errorMessage}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="mt-3"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return null;
};

export default TeamLoadingState;
