
import React from 'react';
import CreateBackupCard from './CreateBackupCard';
import BackupList from './BackupList';

interface BackupsTabProps {
  isBackingUp: boolean;
  backupProgress: number;
  handleStartBackup: () => void;
}

const BackupsTab: React.FC<BackupsTabProps> = ({ 
  isBackingUp, 
  backupProgress, 
  handleStartBackup 
}) => {
  return (
    <div className="space-y-6">
      <CreateBackupCard 
        isBackingUp={isBackingUp} 
        backupProgress={backupProgress} 
        handleStartBackup={handleStartBackup} 
      />
      
      <BackupList />
    </div>
  );
};

export default BackupsTab;
