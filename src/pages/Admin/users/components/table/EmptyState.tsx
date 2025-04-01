
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

const EmptyState: React.FC = () => (
  <TableRow>
    <TableCell colSpan={6} className="h-24 text-center">
      <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
        <p className="mb-2 text-sm">No users found</p>
        <p className="text-xs">Try changing your search or filter settings</p>
      </div>
    </TableCell>
  </TableRow>
);

export default EmptyState;
