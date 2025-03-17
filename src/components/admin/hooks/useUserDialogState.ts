
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/toast-wrapper';

export interface CustomRole {
  id: string;
  name: string;
  base_type: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  password?: string;
  notes?: string;
  customRoleId?: string;
}

interface UseUserDialogStateProps {
  initialData?: Partial<UserFormData>;
  mode: 'add' | 'edit';
}

export const useUserDialogState = ({ initialData = {}, mode }: UseUserDialogStateProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    role: initialData.role || 'user',
    status: initialData.status || 'active',
    password: '',
    notes: initialData.notes || '',
    customRoleId: initialData.customRoleId || '',
  });
  
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isAdmin, createUser } = useAuth();

  const fetchCustomRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const { data, error } = await supabase
        .from('custom_roles')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching custom roles:', error);
        return;
      }
      
      setCustomRoles(data || []);
      
      // Set default role based on selected basic role if no custom role is already selected
      if (!formData.customRoleId) {
        const defaultRole = data?.find(r => r.base_type === formData.role && 
          (r.name === 'Admin' || r.name === 'Manager' || r.name === 'User'));
        
        if (defaultRole) {
          setFormData(prev => ({...prev, customRoleId: defaultRole.id}));
        }
      }
    } catch (error) {
      console.error('Error fetching custom roles:', error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchCustomRoles();
  }, []);

  const handleInputChange = (key: keyof UserFormData, value: string) => {
    setFormData(prev => ({...prev, [key]: value}));
  };

  const handleRoleChange = (value: 'admin' | 'user' | 'manager') => {
    setFormData(prev => ({...prev, role: value}));
    
    // Find the default role for this base type
    const defaultRole = customRoles.find(role => role.base_type === value && 
      (role.name === 'Admin' || role.name === 'Manager' || role.name === 'User'));
    
    if (defaultRole) {
      setFormData(prev => ({...prev, customRoleId: defaultRole.id}));
    } else {
      setFormData(prev => ({...prev, customRoleId: ''}));
    }
  };

  const getBasicRoleFromCustomRole = (roleId: string): 'admin' | 'user' | 'manager' => {
    const role = customRoles.find(r => r.id === roleId);
    if (!role) return 'user';
    
    if (role.base_type === 'admin') return 'admin';
    if (role.base_type === 'manager') return 'manager';
    return 'user';
  };

  const handleCustomRoleChange = (roleId: string) => {
    setFormData(prev => ({...prev, customRoleId: roleId}));
    
    // Update the basic role to match the custom role's base type
    if (roleId) {
      const basicRole = getBasicRoleFromCustomRole(roleId);
      setFormData(prev => ({...prev, role: basicRole}));
    }
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

    return true;
  };

  return {
    formData,
    customRoles,
    isLoadingRoles,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    handleInputChange,
    handleRoleChange,
    handleCustomRoleChange,
    getBasicRoleFromCustomRole,
    isAdmin,
    createUser
  };
};
