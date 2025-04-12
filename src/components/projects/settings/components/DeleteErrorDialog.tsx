
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
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Error Deleting Project</AlertDialogTitle>
          <AlertDialogDescription>
            {errorMessage || "An unexpected error occurred during deletion."}
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
