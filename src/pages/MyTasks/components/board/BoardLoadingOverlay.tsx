
import React from 'react';
import { Loader } from 'lucide-react';

interface BoardLoadingOverlayProps {
  isLoading: boolean;
}

const BoardLoadingOverlay: React.FC<BoardLoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2">Updating board...</p>
      </div>
    </div>
  );
};

export default BoardLoadingOverlay;
