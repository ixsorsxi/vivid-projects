
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Trash2, Shield } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import AddMemberDialog from './add-member/AddMemberDialog';
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
}

interface ProjectTeamManagerProps {
  projectId: string;
}

const ProjectTeamManager: React.FC<ProjectTeamManagerProps> = ({ projectId }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      if (data && data.user) {
        setCurrentUser(data.user.id);
      }
    });

    fetchTeamMembers();
  }, [projectId]);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select('id, user_id, project_member_name, role')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('Team members loaded:', data);
      
      setTeamMembers(data.map(member => ({
        id: member.id,
        user_id: member.user_id,
        name: member.project_member_name || 'Unnamed Member',
        role: member.role
      })));
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Team member removed');
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleMakeManager = async (memberId: string) => {
    try {
      // Find member to promote
      const memberToPromote = teamMembers.find(m => m.id === memberId);
      if (!memberToPromote) return;

      // Update project manager in projects table
      const { error: projectError } = await supabase
        .from('projects')
        .update({ project_manager_id: memberToPromote.user_id })
        .eq('id', projectId);

      if (projectError) throw projectError;

      // Update member role
      const { error: memberError } = await supabase
        .from('project_members')
        .update({ role: 'project_manager' })
        .eq('id', memberId);

      if (memberError) throw memberError;

      toast.success(`${memberToPromote.name} is now the project manager`);
      fetchTeamMembers(); // Refresh the list
    } catch (error) {
      console.error('Error updating project manager:', error);
      toast.error('Failed to update project manager', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'project_manager':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'developer':
        return 'bg-green-500 hover:bg-green-600';
      case 'designer':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'client_stakeholder':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatRoleLabel = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Team</CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="flex items-center gap-1"
        >
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6">Loading team members...</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No team members yet. Add team members to collaborate on this project.
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
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <Badge className={`text-xs font-normal text-white ${getRoleBadgeColor(member.role)}`}>
                      {formatRoleLabel(member.role)}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {member.role !== 'project_manager' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMakeManager(member.id)}
                      title="Make Project Manager"
                    >
                      <Shield className="h-4 w-4 text-blue-500" />
                    </Button>
                  )}
                  {member.user_id !== currentUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      title="Remove Member"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        projectId={projectId}
        onAddSuccess={fetchTeamMembers}
      />
    </Card>
  );
};

export default ProjectTeamManager;
