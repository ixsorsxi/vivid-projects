
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserFormData } from '../hooks/useUserDialogState';

interface BasicInfoFieldsProps {
  formData: UserFormData;
  handleInputChange: (key: keyof UserFormData, value: string) => void;
  mode: 'add' | 'edit';
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  handleInputChange,
  mode
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Basic Information</h3>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john.doe@example.com"
            required
            disabled={mode === 'edit'}
          />
          {mode === 'edit' && (
            <p className="text-xs text-muted-foreground mt-1">
              Email addresses cannot be changed after account creation.
            </p>
          )}
        </div>
        
        {mode === 'add' && (
          <div className="grid gap-2">
            <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
            <Input
              id="password"
              type="password"
              value={formData.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter secure password"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 6 characters long.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoFields;
