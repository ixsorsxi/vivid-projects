
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: (confirmText: string) => void;
  isDeleting: boolean;
}

const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirmDelete,
  isDeleting
}) => {
  const [confirmText, setConfirmText] = useState("");
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the project
            and all associated data including tasks, files, and comments.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Please type <strong>delete</strong> to confirm:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type 'delete' to confirm"
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onConfirmDelete(confirmText)}
            disabled={confirmText !== "delete" || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProjectDialog;
