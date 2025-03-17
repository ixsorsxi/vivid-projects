
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface TaskDetailsFooterProps {
  onOpenChange: (open: boolean) => void;
  onEditClick: () => void;
}

const TaskDetailsFooter: React.FC<TaskDetailsFooterProps> = ({ onOpenChange, onEditClick }) => {
  return (
    <DialogFooter className="mt-6">
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
