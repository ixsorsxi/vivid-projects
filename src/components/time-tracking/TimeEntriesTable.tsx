
import React from 'react';
import { TimeEntry } from './types';
import TimeEntryRow from './TimeEntryRow';

interface TimeEntriesTableProps {
  entries: TimeEntry[];
}

const TimeEntriesTable: React.FC<TimeEntriesTableProps> = ({ entries }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-sm">Task</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Project</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Start</th>
            <th className="text-left py-3 px-4 font-medium text-sm">End</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Duration</th>
            <th className="text-left py-3 px-4 font-medium text-sm">User</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {entries.map((entry) => (
            <TimeEntryRow key={entry.id} entry={entry} />
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Showing {entries.length} of 52 entries
      </div>
    </div>
  );
};

export default TimeEntriesTable;
