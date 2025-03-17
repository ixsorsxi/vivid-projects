
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HardDrive, Download, RotateCcw, Database, History, CheckCircle2, Calendar } from 'lucide-react';

export interface BackupItemProps {
  name: string;
  date: string;
  size: string;
  type: 'full' | 'incremental' | 'differential';
  status?: 'completed' | 'in-progress' | 'failed';
}

const BackupItem: React.FC<BackupItemProps> = ({ 
  name, 
  date, 
  size, 
  type,
  status = 'completed'
}) => {
  const statusColors = {
    'completed': 'bg-success/10 text-success',
    'in-progress': 'bg-primary/10 text-primary',
    'failed': 'bg-destructive/10 text-destructive'
  };
  
  const typeIcons = {
    'full': <Database className="h-4 w-4" />,
    'incremental': <History className="h-4 w-4" />,
    'differential': <RotateCcw className="h-4 w-4" />
  };

  return (
    <div className="p-4 border border-border/40 rounded-md bg-card flex items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
        <HardDrive className="h-5 w-5 text-foreground/70" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{name}</h4>
          <Badge variant="outline" className="flex items-center gap-1">
            {typeIcons[type]}
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </Badge>
          <Badge className={statusColors[status]}>
            {status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div className="flex text-sm text-muted-foreground mt-1">
          <div className="flex items-center gap-1 mr-4">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="h-3.5 w-3.5" />
            <span>{size}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <RotateCcw className="h-4 w-4" />
          <span>Restore</span>
        </Button>
      </div>
    </div>
  );
};

export default BackupItem;
