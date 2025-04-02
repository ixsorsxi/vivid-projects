
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';

export const useTeamData = (initialTeam: TeamMember[] = [], projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Log initial team data to help debug
    console.log('useTeamData initialTeam:', initialTeam);
    
    if (!initialTeam || initialTeam.length === 0) {
      // If no initial team is provided, try to fetch from the server
      if (projectId) {
        refreshTeamMembers();
        return;
      }
    }
    
    const validTeam = (initialTeam || []).map(member => ({
      id: member.id || String(Date.now()),
      name: member.name || 'Team Member', // Use name field primarily
      role: member.role || 'Member',
      user_id: member.user_id
    }));
    
    console.log('Processed team members:', validTeam);
    setTeamMembers(validTeam);
  }, [initialTeam, projectId]);

  const refreshTeamMembers = async () => {
    if (!projectId) return;
    
    setIsRefreshing(true);
    try {
      console.log('Refreshing team members for project:', projectId);

      // Try multiple approaches to fetch team data - this helps work around RLS issues
      let fetchedMembers: TeamMember[] = [];
      let fetchSuccess = false;
      
      // === Approach 1: Direct query with proper error handling ===
      try {
        console.log("Trying direct query to project_members table");
        const { data, error } = await supabase
          .from('project_members')
          .select('id, user_id, name, role')
          .eq('project_id', projectId);
        
        if (!error && data && data.length > 0) {
          console.log('Team members from direct query:', data);
          fetchedMembers = data.map(member => ({
            id: member.id,
            name: member.name || 'Team Member',
            role: member.role || 'Member',
            user_id: member.user_id
          }));
          
          fetchSuccess = true;
        } else if (error) {
          console.log('Direct query error:', error.message, error.code);
          
          if (error.code === '42P17' && error.message.includes('infinite recursion')) {
            console.log('RLS policy recursion error detected, trying other methods');
          }
        }
      } catch (directErr) {
        console.warn('Exception in direct query:', directErr);
      }
      
      // === Approach 2: Try API function if direct query fails ===
      if (!fetchSuccess) {
        try {
          console.log('Trying API function to fetch team members');
          const members = await fetchProjectTeamMembers(projectId);
          
          if (members && members.length > 0) {
            console.log('Team members from API function:', members);
            fetchedMembers = members.map(member => ({
              ...member,
              name: member.name || 'Team Member', 
              role: member.role || 'Member'
            }));
            
            fetchSuccess = true;
          }
        } catch (apiErr) {
          console.warn('Error in API function call:', apiErr);
        }
      }
      
      // === Approach 3: Try RPC function as last resort ===
      if (!fetchSuccess) {
        try {
          console.log('Trying RPC function to get project data including team');
          const { data: projectData, error: rpcError } = await supabase
            .rpc('get_project_by_id', { p_project_id: projectId });
          
          if (!rpcError && projectData) {
            const project = Array.isArray(projectData) ? projectData[0] : projectData;
            
            if (project && project.team && Array.isArray(project.team)) {
              console.log('Team data from RPC:', project.team);
              fetchedMembers = project.team.map((member: any) => ({
                id: member.id || String(Date.now()),
                name: member.name || 'Team Member',
                role: member.role || 'Member',
                user_id: member.user_id
              }));
              
              fetchSuccess = true;
            }
          } else if (rpcError) {
            console.error('RPC error:', rpcError);
          }
        } catch (rpcErr) {
          console.warn('Error in RPC call:', rpcErr);
        }
      }
      
      // Update state if any method was successful
      if (fetchSuccess) {
        console.log('Successfully fetched team members via one of the methods:', fetchedMembers);
        setTeamMembers(fetchedMembers);
      } else {
        // If all methods failed, show an error
        console.warn('Could not retrieve team members through any method');
        toast.error("Couldn't refresh team members", {
          description: "Please try again or reload the page"
        });
      }
    } catch (err) {
      console.error('Error in refreshTeamMembers:', err);
      toast.error("Error refreshing team", {
        description: "An unexpected error occurred"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  };
};
