
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TaskDetailsFooterProps {
  onOpenChange: (open: boolean) => void;
  onEditClick: () => void;
}

const TaskDetailsFooter: React.FC<TaskDetailsFooterProps> = ({ 
  onOpenChange,
  onEditClick 
}) => {
  return (
    <DialogFooter className="gap-2 sm:gap-0">
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Close
      </Button>
      <Button onClick={onEditClick}>
        Edit Task
      </Button>
    </DialogFooter>
  );
};

export default TaskDetailsFooter;
