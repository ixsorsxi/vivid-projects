
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check if the current user has access to a project
 */
export const useProjectAccessChecker = (projectId?: string) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setIsChecking(false);
      return;
    }

    const checkAccess = async () => {
      setIsChecking(true);
      setError(null);
      
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('Error getting current user:', userError);
          setIsChecking(false);
          setError(userError || new Error('User not authenticated'));
          return;
        }

        console.log('Checking project access for user:', user.id, 'and project:', projectId);
        
        // Check if user is project owner directly (most reliable check)
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('user_id')
          .eq('id', projectId)
          .maybeSingle();
        
        if (!projectError && projectData) {
          console.log('Project owner is:', projectData.user_id, 'Current user is:', user.id);
          
          const isOwner = projectData.user_id === user.id;
          setIsProjectOwner(isOwner);
          
          if (isOwner) {
            setHasAccess(true);
            setIsChecking(false);
            return;
          }
        } else {
          console.error('Error checking project ownership:', projectError);
        }
        
        // Check if user is admin
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        
        if (!profileError && profileData && profileData.role === 'admin') {
          console.log('User is admin');
          setIsAdmin(true);
          setHasAccess(true);
          setIsChecking(false);
          return;
        }
        
        // Check if user is a member of the project
        const { data: memberData, error: memberError } = await supabase
          .from('project_members')
          .select('id')
          .eq('project_id', projectId)
          .eq('user_id', user.id)
          .is('left_at', null)
          .maybeSingle();
        
        if (!memberError && memberData) {
          console.log('User is a team member');
          setIsTeamMember(true);
          setHasAccess(true);
        } else {
          console.log('User is not a team member:', memberError);
          setHasAccess(false);
        }
      } catch (err) {
        console.error('Error checking project access:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [projectId]);

  return {
    hasAccess,
    isProjectOwner,
    isAdmin, 
    isTeamMember,
    isChecking,
    error
  };
};
