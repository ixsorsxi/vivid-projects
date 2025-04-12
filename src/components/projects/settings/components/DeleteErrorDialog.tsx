
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteErrorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: string | null;
}

const DeleteErrorDialog: React.FC<DeleteErrorDialogProps> = ({
  isOpen,
  onOpenChange,
  errorMessage
}) => {
  // Check if this is a recursion policy issue
  const isPolicyError = errorMessage?.includes('recursion') || 
                        errorMessage?.includes('policy') ||
                        errorMessage?.includes('permission');
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete failed</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            {isPolicyError ? (
              <>
                <p className="text-destructive font-medium">Database security policy issue detected</p>
                <p>This project couldn't be deleted due to database security policy constraints.</p>
                <p className="text-xs text-muted-foreground">
                  Try using the admin interface or contact support for assistance.
                </p>
              </>
            ) : (
              <p>{errorMessage || "There was a problem deleting this project. Please try again."}</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteErrorDialog;
