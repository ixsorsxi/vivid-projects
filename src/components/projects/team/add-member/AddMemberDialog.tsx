
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast-wrapper";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember?: (email: string) => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  onAddMember
}) => {
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const handleAddMember = () => {
    if (!newMemberEmail) {
      toast.error("Error", {
        description: "Please enter an email address",
      });
      return;
    }

    // Call the passed onAddMember function if provided
    if (onAddMember) {
      onAddMember(newMemberEmail);
    } else {
      // Fallback if no handler is provided
      toast("Invitation sent", {
        description: `An invitation has been sent to ${newMemberEmail}`,
      });
    }
    
    setNewMemberEmail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to a new team member via email.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddMember}>
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
