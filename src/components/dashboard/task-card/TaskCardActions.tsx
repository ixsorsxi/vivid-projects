
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

  // Handlers with explicit event prevention and robust safety measures
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewDetails) {
      // Close dropdown first
      document.body.click();
      // Then execute callback after a brief delay
      setTimeout(() => onViewDetails(), 10);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      // Close dropdown first
      document.body.click();
      // Then execute callback after a brief delay
      setTimeout(() => onEdit(), 10);
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      // Close dropdown first
      document.body.click();
      // Then execute callback after a brief delay
      setTimeout(() => onDelete(), 10);
    }
  };

  // Prevent dropdown trigger from propagating click events
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 -mr-2" 
          onClick={handleTriggerClick}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        onCloseAutoFocus={(e) => {
          // Prevent focus events from bubbling
          e.preventDefault();
        }}
      >
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskCardActions;
