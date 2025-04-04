
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserFormData } from '../hooks/useUserDialogState';

interface AdditionalInfoFieldsProps {
  formData: UserFormData;
  handleInputChange: (key: keyof UserFormData, value: string) => void;
}

const AdditionalInfoFields: React.FC<AdditionalInfoFieldsProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Information</h3>
      
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes (Internal)</Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about this user (not visible to the user)"
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default AdditionalInfoFields;
