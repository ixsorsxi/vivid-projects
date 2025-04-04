
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  return (
    <>
      {projectId && (
        <div className="text-xs text-muted-foreground border border-muted rounded px-2 py-1 mt-2">
          Project ID: {projectId}
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting || isDisabled}
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
