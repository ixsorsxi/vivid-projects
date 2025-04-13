
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  if (!isLoading && !hasError) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading team members...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col space-y-2">
          <span>Error loading team members: {errorMessage || 'Unknown error'}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="self-start mt-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default TeamLoadingState;
