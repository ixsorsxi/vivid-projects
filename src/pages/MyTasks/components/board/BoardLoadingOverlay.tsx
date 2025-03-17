
import React from 'react';
import { Loader } from 'lucide-react';

interface BoardLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const BoardLoadingOverlay: React.FC<BoardLoadingOverlayProps> = ({ 
  isLoading,
  message = 'Loading tasks...'
}) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50 backdrop-blur-sm rounded-lg">
      <div className="flex flex-col items-center">
        <Loader className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default BoardLoadingOverlay;
