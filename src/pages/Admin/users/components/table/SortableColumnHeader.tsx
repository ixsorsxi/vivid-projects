
import React from 'react';
import { TableHead } from '@/components/ui/table';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { SortKey } from '../types/userTableTypes';

interface SortableColumnHeaderProps {
  label: string;
  sortKey: SortKey;
  currentSort: { key: SortKey; direction: 'asc' | 'desc' } | null;
  onSort: (key: SortKey) => void;
}

const SortableColumnHeader: React.FC<SortableColumnHeaderProps> = ({
  label,
  sortKey,
  currentSort,
  onSort,
}) => {
  const renderSortIndicator = () => {
    if (!currentSort || currentSort.key !== sortKey) {
      return null;
    }
    
    return (
      <span className="ml-1 text-primary">
        {currentSort.direction === 'asc' ? 
          <ArrowUp className="inline h-3 w-3" /> : 
          <ArrowDown className="inline h-3 w-3" />
        }
      </span>
    );
  };

  return (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 transition-colors" 
      onClick={() => onSort(sortKey)}
    >
      {label} {renderSortIndicator()}
    </TableHead>
  );
};

export default SortableColumnHeader;
