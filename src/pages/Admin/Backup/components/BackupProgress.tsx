
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface BackupProgressProps {
  progress: number;
  isBackingUp: boolean;
}

const BackupProgress: React.FC<BackupProgressProps> = ({ progress, isBackingUp }) => {
  if (!isBackingUp) return null;
  
  return (
    <div className="mb-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span>Backup in progress</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default BackupProgress;
