
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check if the current user has access to a project
 * Uses the standardized can_access_project function
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
        // First check access using standardized function
        const { data: hasProjectAccess, error: accessError } = await supabase.rpc(
          'can_access_project',
          { p_project_id: projectId }
        );
        
        if (accessError) {
          console.error('Error checking project access:', accessError);
          setError(accessError);
          setIsChecking(false);
          return;
        }
        
        if (hasProjectAccess) {
          setHasAccess(true);
          
          // Get current user
          const { data: { user }, error: userError } = await supabase.auth.getUser();
        
          if (userError || !user) {
            console.error('Error getting current user:', userError);
            setError(userError || new Error('User not authenticated'));
            setIsChecking(false);
            return;
          }
          
          // Check if user is project owner
          const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('user_id')
            .eq('id', projectId)
            .maybeSingle();
          
          if (!projectError && projectData) {
            setIsProjectOwner(projectData.user_id === user.id);
          }
          
          // Check if user is admin
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          
          if (!profileError && profileData && profileData.role === 'admin') {
            setIsAdmin(true);
          }
          
          // Check if user is a team member
          const { data: memberData, error: memberError } = await supabase
            .from('project_members')
            .select('id')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .is('left_at', null)
            .maybeSingle();
            
          setIsTeamMember(!!memberData && !memberError);
        } else {
          setHasAccess(false);
          setIsProjectOwner(false);
          setIsAdmin(false);
          setIsTeamMember(false);
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
