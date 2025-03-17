
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeEntry } from './types';
import TimeEntryRow from './TimeEntryRow';

interface TimeEntriesTableProps {
  entries: TimeEntry[];
  currentPage?: number;
  totalEntries?: number;
  entriesPerPage?: number;
  onPageChange?: (page: number) => void;
}

const TimeEntriesTable: React.FC<TimeEntriesTableProps> = ({ 
  entries, 
  currentPage = 1,
  totalEntries = 52,
  entriesPerPage = 10,
  onPageChange = () => {}
}) => {
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
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
            {entries.length > 0 ? (
              entries.map((entry) => (
                <TimeEntryRow key={entry.id} entry={entry} />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-6 text-center text-muted-foreground">
                  No time entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {entries.length} of {totalEntries} entries
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimeEntriesTable;
