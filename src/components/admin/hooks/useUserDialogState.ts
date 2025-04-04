
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/toast-wrapper';

export interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  password?: string;
  notes?: string;
}

interface UseUserDialogStateProps {
  initialData?: Partial<UserFormData>;
  mode: 'add' | 'edit';
}

export const useUserDialogState = ({ initialData = {}, mode = 'add' }: UseUserDialogStateProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    role: initialData.role || 'user',
    status: initialData.status || 'active',
    password: '',
    notes: initialData.notes || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, createUser } = useAuth();

  const handleInputChange = (key: keyof UserFormData, value: string) => {
    setFormData(prev => ({...prev, [key]: value}));
  };

  const handleRoleChange = (value: 'admin' | 'user' | 'manager') => {
    setFormData(prev => ({...prev, role: value}));
  };

  const validateForm = (): boolean => {
    if (!isAdmin) {
      toast.error("Unauthorized", {
        description: `Only administrators can ${mode === 'add' ? 'create' : 'edit'} users`,
      });
      return false;
    }

    if (!formData.name || !formData.email) {
      toast.error("Missing information", {
        description: "Please fill in all required fields",
      });
      return false;
    }

    if (mode === 'add' && !formData.password) {
      toast.error("Missing password", {
        description: "Please provide a password for the new user",
      });
      return false;
    }

    if (mode === 'add' && formData.password && formData.password.length < 6) {
      toast.error("Weak password", {
        description: "Password must be at least 6 characters long",
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address",
      });
      return false;
    }

    return true;
  };

  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    handleInputChange,
    handleRoleChange,
    isAdmin,
    createUser
  };
};
