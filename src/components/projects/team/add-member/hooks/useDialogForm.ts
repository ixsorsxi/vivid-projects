
import { useState, useEffect } from 'react';
import { SystemUser } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

export const useDialogForm = (open: boolean) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<string>('user');
  
  // Form state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('team_member');
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // User selection state
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      // Only fetch users when dialog opens
      fetchSystemUsers();
    } else {
      // Reset form when dialog closes
      resetForm();
    }
  }, [open]);
  
  // Validate form based on active tab
  useEffect(() => {
    if (activeTab === 'user') {
      setIsFormValid(!!selectedUser && !!role);
    } else {
      setIsFormValid(!!name && !!role);
    }
  }, [activeTab, name, role, selectedUser]);

  // Reset the form to initial state
  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('team_member');
    setError(null);
    setActiveTab('user');
    setSelectedUser(null);
  };
  
  // Fetch system users
  const fetchSystemUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, role')
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      
      const users: SystemUser[] = data.map(user => ({
        id: user.id,
        name: user.full_name || user.username || 'Unnamed User',
        email: user.username,
        role: user.role || 'user',
        avatar: user.avatar_url
      }));
      
      debugLog('AddMemberDialog', 'Fetched system users:', users);
      setSystemUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    name,
    setName,
    email,
    setEmail,
    role,
    setRole,
    error,
    setError,
    isFormValid,
    systemUsers,
    isLoadingUsers,
    selectedUser,
    setSelectedUser,
    resetForm
  };
};
