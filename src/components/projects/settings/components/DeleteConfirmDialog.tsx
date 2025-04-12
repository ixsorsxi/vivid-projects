
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  projectName: string;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: (confirmText: string) => Promise<boolean>;
  isDeleting: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  projectName,
  onOpenChange,
  onConfirmDelete,
  isDeleting
}) => {
  const [confirmText, setConfirmText] = useState("");
  
  const handleDelete = async () => {
    await onConfirmDelete(confirmText);
    if (!isDeleting) {
      setConfirmText("");
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open) setConfirmText("");
      onOpenChange(open);
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-destructive">
            <Trash2 className="mr-2 h-5 w-5" />
            Delete Project
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              This action <span className="font-bold">cannot be undone</span>. This will permanently delete the
              <span className="font-semibold"> {projectName}</span> project and all associated data including tasks,
              files, and comments.
            </p>
            
            <div className="pt-2">
              <label htmlFor="confirm" className="text-sm font-medium block mb-2">
                To confirm, type <span className="font-bold">delete</span> below:
              </label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type 'delete' to confirm"
                className="w-full"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={confirmText !== "delete" || isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
