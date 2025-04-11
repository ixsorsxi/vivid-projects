
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2 } from "lucide-react";
import { useParams } from 'react-router-dom';
import AddMemberDialog from './AddMemberDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2 } from 'lucide-react';
import { 
  fixRlsPolicy, 
  checkProjectMemberAccess 
} from '@/api/projects/modules/team/fixRlsPolicy';
import { 
  fetchTeamMembersWithPermissions,
  fetchTeamMembersAsOwner
} from '@/api/projects/modules/team/fixTeamExports';
import { useProjectAccessChecker } from '@/hooks/useProjectAccessChecker';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  user_id?: string;
}

const TeamSection = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isFetchFailed, setIsFetchFailed] = useState(false);
  const { hasAccess, isProjectOwner, isAdmin, isChecking } = useProjectAccessChecker(projectId);

  // A more comprehensive fetch approach that tries multiple methods
  const fetchTeamMembers = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setErrorDetails(null);
    setIsFetchFailed(false);
    
    try {
      console.log('Fetching team members for project:', projectId);
      
      // Step 1: Try to fix any RLS policy issues first
      await fixRlsPolicy(projectId);
      
      // Step 2: First attempt - Use the security definer approach
      try {
        console.log('ATTEMPT 1: Using security definer function');
        const members = await fetchTeamMembersWithPermissions(projectId);
        
        if (members && members.length > 0) {
          console.log('Successfully fetched team members with fetchTeamMembersWithPermissions');
          setTeamMembers(members);
          setIsLoading(false);
          return;
        }
      } catch (securityDefinerError) {
        console.error('Error with security definer approach:', securityDefinerError);
      }
      
      // Step 3: Second attempt - Try project owner approach
      try {
        console.log('ATTEMPT 2: Using project owner approach');
        const membersAsOwner = await fetchTeamMembersAsOwner(projectId);
        
        if (membersAsOwner && membersAsOwner.length > 0) {
          console.log('Successfully fetched team members with fetchTeamMembersAsOwner');
          setTeamMembers(membersAsOwner);
          setIsLoading(false);
          return;
        }
      } catch (ownerError) {
        console.error('Error with owner approach:', ownerError);
      }
      
      // Step 4: Third attempt - Direct RPC call to a function that returns members
      try {
        console.log('ATTEMPT 3: Using direct RPC call');
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'get_project_team_with_permissions',
          { p_project_id: projectId }
        );
        
        if (!rpcError && rpcData && rpcData.length > 0) {
          console.log('Successfully fetched team members via RPC');
          
          const formattedMembers: TeamMember[] = rpcData.map((member: any) => ({
            id: member.id,
            name: member.name || 'Unnamed Member',
            role: member.role || 'Team Member',
            user_id: member.user_id
          }));
          
          setTeamMembers(formattedMembers);
          setIsLoading(false);
          return;
        } else if (rpcError) {
          console.error('Error with direct RPC approach:', rpcError);
          setErrorDetails(prev => prev ? `${prev}\n\nRPC Error: ${rpcError.message}` : `RPC Error: ${rpcError.message}`);
        }
      } catch (rpcAttemptError) {
        console.error('Exception in RPC attempt:', rpcAttemptError);
      }
      
      // Step 5: Fourth attempt - Direct query with project access check
      try {
        console.log('ATTEMPT 4: Using direct query with access check');
        const hasProjectAccess = await checkProjectMemberAccess(projectId);
        
        if (hasProjectAccess) {
          const { data: membersData, error: membersError } = await supabase
            .from('project_members')
            .select('id, project_member_name, role, user_id')
            .eq('project_id', projectId)
            .is('left_at', null);
          
          if (!membersError && membersData) {
            console.log('Successfully fetched team members via direct query after access check');
            
            const formattedMembers: TeamMember[] = membersData.map(member => ({
              id: member.id,
              name: member.project_member_name || 'Unnamed Member',
              role: member.role || 'Team Member',
              user_id: member.user_id
            }));
            
            setTeamMembers(formattedMembers);
            setIsLoading(false);
            return;
          } else if (membersError) {
            console.error('Error with direct query after access check:', membersError);
            setErrorDetails(prev => prev ? `${prev}\n\nQuery Error: ${membersError.message}` : `Query Error: ${membersError.message}`);
          }
        }
      } catch (directQueryError) {
        console.error('Exception in direct query attempt:', directQueryError);
      }
      
      // All attempts failed
      console.error('All team member fetch attempts failed');
      setIsFetchFailed(true);
      setTeamMembers([]);
      
      // Show detailed error to admins/owners, simplified for others
      if (isProjectOwner || isAdmin) {
        setErrorDetails(prev => prev || 'Multiple approaches to fetch team members failed. This might be due to a recursive RLS policy issue.');
      }
    } catch (error: any) {
      console.error('Exception in fetchTeamMembers:', error);
      setErrorDetails(error.message || 'Unknown error occurred');
      setIsFetchFailed(true);
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, isProjectOwner, isAdmin]);

  // Initialize by attempting to fix the RLS policy
  useEffect(() => {
    if (projectId) {
      console.log('Initializing team section with RLS policy fix attempt');
      fixRlsPolicy(projectId);
    }
  }, [projectId]);

  // Fetch team members when access status changes
  useEffect(() => {
    if (projectId && !isChecking) {
      console.log('Access status resolved, fetching team members. Has access:', hasAccess);
      fetchTeamMembers();
    }
  }, [projectId, hasAccess, isChecking, fetchTeamMembers]);

  const handleAddMember = async (member: { name: string; role: string; user_id?: string }): Promise<boolean> => {
    if (!projectId) return false;
    if (!member.user_id) {
      toast.error('User ID is required');
      return false;
    }
    
    try {
      console.log('Adding team member to project:', projectId, member);
      
      // Try using the RPC function first for better security
      const { data, error } = await supabase.rpc(
        'add_project_member',
        { 
          p_project_id: projectId,
          p_user_id: member.user_id,
          p_name: member.name,
          p_role: member.role
        }
      );
      
      if (error) {
        console.error('Error adding team member via RPC:', error);
        
        // Fallback to direct insert if RPC fails
        const { data: insertData, error: insertError } = await supabase
          .from('project_members')
          .insert({
            project_id: projectId,
            user_id: member.user_id,
            project_member_name: member.name,
            role: member.role
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error adding team member via direct insert:', insertError);
          
          if (insertError.message.includes('already a member')) {
            toast.error('User already a member', {
              description: 'This user is already a member of the project.'
            });
          } else if (insertError.message.includes('permission denied')) {
            toast.error('Access denied', { 
              description: 'You do not have permission to add members to this project.'
            });
          } else {
            toast.error('Failed to add team member', {
              description: insertError.message
            });
          }
          return false;
        }
        
        // Add the new member to the local state
        if (insertData) {
          setTeamMembers(prev => [...prev, { 
            id: insertData.id,
            name: member.name,
            role: member.role,
            user_id: member.user_id
          }]);
        
          toast.success('Team member added successfully');
          fetchTeamMembers(); // Refresh the list to get correct data
          return true;
        }
      } else {
        toast.success('Team member added successfully');
        fetchTeamMembers(); // Refresh the list to get correct data
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Exception in handleAddMember:', error);
      toast.error('Failed to add team member', {
        description: error.message || 'An unexpected error occurred'
      });
      return false;
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!projectId) return;
    
    try {
      console.log('Removing team member:', memberId);
      
      // Try using the RPC function first for better security
      const { data, error } = await supabase.rpc(
        'remove_project_member',
        { 
          p_project_id: projectId,
          p_member_id: memberId
        }
      );
      
      if (error) {
        console.error('Error removing team member via RPC:', error);
        
        // Fallback to direct update if RPC fails
        const { error: updateError } = await supabase
          .from('project_members')
          .update({ left_at: new Date().toISOString() })
          .eq('id', memberId)
          .eq('project_id', projectId);
        
        if (updateError) {
          console.error('Error removing team member via direct update:', updateError);
          
          if (updateError.message.includes('permission denied')) {
            toast.error('Access denied', { 
              description: 'You do not have permission to remove members from this project.'
            });
          } else {
            toast.error('Failed to remove team member', {
              description: updateError.message
            });
          }
          return;
        }
      }
      
      // Update local state on success
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success('Team member removed');
    } catch (error: any) {
      console.error('Exception in handleRemoveMember:', error);
      toast.error('Failed to remove team member', {
        description: error.message || 'An unexpected error occurred'
      });
    }
  };

  const handleRetryFetch = () => {
    setIsLoading(true);
    setErrorDetails(null);
    setIsFetchFailed(false);
    fetchTeamMembers();
  };

  if (!projectId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Team</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select a project to view its team.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Team</CardTitle>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            size="sm"
            className="flex items-center gap-1"
            disabled={isChecking || !hasAccess || isLoading}
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6 flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          ) : isChecking ? (
            <div className="text-center py-6 flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Checking access permissions...</p>
            </div>
          ) : !hasAccess ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>You don't have permission to view team members for this project.</p>
            </div>
          ) : isFetchFailed ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-3">Error loading team members.</p>
              
              {errorDetails && (
                <Collapsible className="w-full mb-4">
                  <div className="text-center mb-2">
                    <CollapsibleTrigger className="text-primary text-sm underline">
                      Show error details
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="bg-red-50 p-3 text-sm rounded-md border border-red-200 my-2 text-left">
                    <code className="text-red-600 whitespace-pre-wrap">{errorDetails}</code>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryFetch}
                className="mx-auto"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No team members yet. Add team members to collaborate on this project.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={isChecking || !hasAccess}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        projectId={projectId}
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default TeamSection;
