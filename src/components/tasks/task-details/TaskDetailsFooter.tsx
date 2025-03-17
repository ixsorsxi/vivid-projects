
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface TaskDetailsFooterProps {
  onOpenChange: (open: boolean) => void;
  onEditClick: () => void;
  onDeleteClick?: () => void;
  showDelete?: boolean;
}

const TaskDetailsFooter: React.FC<TaskDetailsFooterProps> = ({ 
  onOpenChange, 
  onEditClick,
  onDeleteClick,
  showDelete = true
}) => {
  return (
    <DialogFooter className="mt-6 flex justify-between">
      {showDelete && onDeleteClick && (
        <Button variant="outline" onClick={onDeleteClick} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      )}
      
      <Button onClick={() => {
        onOpenChange(false);
        // Ensure dialog is fully closed before opening edit dialog
        setTimeout(() => {
          onEditClick();
        }, 100);
      }}>
        <Edit className="h-4 w-4 mr-2" />
        Edit Task
      </Button>
    </DialogFooter>
  );
};

export default TaskDetailsFooter;
