
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

const EmptyState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
        <div className="flex flex-col items-center space-y-2">
          <p className="font-medium">No users found</p>
          <p className="text-sm">Try changing your search or filter settings</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyState;
