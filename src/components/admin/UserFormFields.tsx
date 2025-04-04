
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { UserFormData } from './hooks/useUserDialogState';
import {
  BasicInfoFields,
  RolePermissionFields,
  AdditionalInfoFields,
  FormAlert
} from './form-fields';

interface UserFormFieldsProps {
  formData: UserFormData;
  handleInputChange: (key: keyof UserFormData, value: string) => void;
  handleRoleChange: (value: 'admin' | 'user' | 'manager') => void;
  mode: 'add' | 'edit';
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  formData,
  handleInputChange,
  handleRoleChange,
  mode
}) => {
  return (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <BasicInfoFields 
        formData={formData}
        handleInputChange={handleInputChange}
        mode={mode}
      />
      
      <Separator />
      
      <RolePermissionFields 
        formData={formData}
        handleInputChange={handleInputChange}
        handleRoleChange={handleRoleChange}
      />
      
      <Separator />
      
      <AdditionalInfoFields 
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      <FormAlert mode={mode} />
    </div>
  );
};

export default UserFormFields;
