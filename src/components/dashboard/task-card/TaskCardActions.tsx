
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash } from 'lucide-react';

interface TaskCardActionsProps {
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  actions?: React.ReactNode;
}

const TaskCardActions: React.FC<TaskCardActionsProps> = ({ 
  onViewDetails, 
  onEdit, 
  onDelete,
  actions 
}) => {
  if (actions) {
    return <>{actions}</>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onViewDetails}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskCardActions;
