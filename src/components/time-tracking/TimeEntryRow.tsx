
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar.custom';
import { TimeEntry } from './types';

interface TimeEntryRowProps {
  entry: TimeEntry;
}

const TimeEntryRow: React.FC<TimeEntryRowProps> = ({ entry }) => {
  return (
    <tr key={entry.id} className="hover:bg-muted/50">
      <td className="py-3 px-4 font-medium">{entry.task}</td>
      <td className="py-3 px-4 text-muted-foreground">{entry.project}</td>
      <td className="py-3 px-4 text-sm">{entry.date}</td>
      <td className="py-3 px-4 text-sm">{entry.startTime}</td>
      <td className="py-3 px-4 text-sm">
        {entry.status === 'running' ? (
          <span className="flex items-center gap-1 text-green-500">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            Running
          </span>
        ) : entry.endTime}
      </td>
      <td className="py-3 px-4 text-sm font-medium tabular-nums">{entry.duration}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Avatar name={entry.user} size="xs" />
          <span className="text-sm">{entry.user}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge 
          variant={entry.status === 'running' ? 'primary' : 'outline'} 
          size="sm"
        >
          {entry.status === 'running' ? 'Active' : 'Completed'}
        </Badge>
      </td>
    </tr>
  );
};

export default TimeEntryRow;
