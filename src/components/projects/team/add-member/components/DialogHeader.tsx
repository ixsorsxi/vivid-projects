
import React from 'react';
import { DialogHeader as UIDialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DialogHeaderProps {
  error: string | null;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ error }) => {
  return (
    <>
      <UIDialogHeader>
        <DialogTitle>Add Project Team Member</DialogTitle>
        <p className="text-sm text-muted-foreground">
          Add a new member to your project team.
        </p>
      </UIDialogHeader>
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
    </>
  );
};

export default DialogHeader;
