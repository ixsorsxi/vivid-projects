
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, UploadCloud } from 'lucide-react';
import BackupProgress from './BackupProgress';

interface CreateBackupCardProps {
  isBackingUp: boolean;
  backupProgress: number;
  handleStartBackup: () => void;
}

const CreateBackupCard: React.FC<CreateBackupCardProps> = ({ 
  isBackingUp, 
  backupProgress, 
  handleStartBackup 
}) => {
  return (
    <Card className="border border-border/40 bg-muted/10">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Create New Backup</h3>
            <p className="text-sm text-muted-foreground">Create a new system backup with selected options</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              disabled={isBackingUp}
              className="flex items-center gap-1"
            >
              <Database className="h-4 w-4" />
              <span>Configure</span>
            </Button>
            <Button 
              onClick={handleStartBackup} 
              disabled={isBackingUp}
              className="flex items-center gap-1"
            >
              <UploadCloud className="h-4 w-4" />
              <span>{isBackingUp ? 'Backing up...' : 'Start Backup'}</span>
            </Button>
          </div>
        </div>
        
        <BackupProgress progress={backupProgress} isBackingUp={isBackingUp} />
      </CardContent>
    </Card>
  );
};

export default CreateBackupCard;
