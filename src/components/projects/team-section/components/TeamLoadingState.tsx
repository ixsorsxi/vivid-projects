
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading team members...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{errorMessage || 'An error occurred while loading team members.'}</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default TeamLoadingState;
