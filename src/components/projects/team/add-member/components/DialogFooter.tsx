
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { debugLog } from '@/utils/debugLogger';

interface DialogFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  projectId?: string;
}

const DialogFooter: React.FC<DialogFooterProps> = ({
  onCancel,
  onSubmit,
  isSubmitting,
  isDisabled,
  projectId
}) => {
  const handleSubmit = () => {
    debugLog('DialogFooter', 'Submitting team member addition');
    debugLog('DialogFooter', `Project ID: ${projectId}, isDisabled: ${isDisabled}, isSubmitting: ${isSubmitting}`);
    onSubmit();
  };

  return (
    <>
      {projectId && (
        <div className="text-xs text-muted-foreground border border-muted rounded px-2 py-1 mt-2">
          Project ID: {projectId}
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isSubmitting}
          type="button"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || isDisabled}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Team Member"
          )}
        </Button>
      </div>
    </>
  );
};

export default DialogFooter;
