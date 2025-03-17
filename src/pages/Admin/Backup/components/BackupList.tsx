
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import BackupItem, { BackupItemProps } from './BackupItem';

// Sample data - in a real app, this would be fetched from an API
const recentBackups: BackupItemProps[] = [
  { 
    name: "Weekly Full Backup", 
    date: "Today at 3:00 AM", 
    size: "4.2 GB", 
    type: "full"
  },
  { 
    name: "Daily Incremental Backup", 
    date: "Yesterday at 3:00 AM", 
    size: "645 MB", 
    type: "incremental"
  },
  { 
    name: "Daily Incremental Backup", 
    date: "May 15, 2025 at 3:00 AM", 
    size: "722 MB", 
    type: "incremental"
  },
  { 
    name: "Database Backup", 
    date: "May 14, 2025 at 2:30 PM", 
    size: "1.8 GB", 
    type: "differential",
    status: "failed"
  },
  { 
    name: "Weekly Full Backup", 
    date: "May 14, 2025 at 3:00 AM", 
    size: "4.1 GB", 
    type: "full"
  }
];

const BackupList: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Backups</h3>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>Show All</span>
        </Button>
      </div>
      
      <div className="space-y-3">
        {recentBackups.map((backup, index) => (
          <BackupItem 
            key={index}
            name={backup.name}
            date={backup.date}
            size={backup.size}
            type={backup.type}
            status={backup.status}
          />
        ))}
      </div>
    </div>
  );
};

export default BackupList;
