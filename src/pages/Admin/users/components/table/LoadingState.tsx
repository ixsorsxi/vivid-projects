
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-8 bg-muted-foreground/30 rounded-full mb-4"></div>
        <p className="mb-6">Loading users...</p>
      </div>
      
      <div className="w-full max-w-2xl space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
