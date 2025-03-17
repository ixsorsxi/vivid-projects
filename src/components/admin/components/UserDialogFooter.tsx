
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UserDialogFooterProps {
  onClose: () => void;
  isSubmitting: boolean;
  isDisabled?: boolean;
  submitLabel: string;
  submittingLabel: string;
}

const UserDialogFooter: React.FC<UserDialogFooterProps> = ({
  onClose,
  isSubmitting,
  isDisabled = false,
  submitLabel,
  submittingLabel
}) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-primary hover:bg-primary/90"
        disabled={isSubmitting || isDisabled}
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </DialogFooter>
  );
};

export default UserDialogFooter;
