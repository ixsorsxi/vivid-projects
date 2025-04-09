
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface DialogFooterProps {
  onClose: () => void;
  isFormValid: boolean;
  isSubmitting: boolean;
}

const AddMemberDialogFooter: React.FC<DialogFooterProps> = ({
  onClose,
  isFormValid,
  isSubmitting
}) => {
  return (
    <DialogFooter className="mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Member'
        )}
      </Button>
    </DialogFooter>
  );
};

export default AddMemberDialogFooter;
