
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMember } from '@/components/projects/team/types';
import { toast } from '@/components/ui/toast-wrapper';
import SystemUsersTab from './SystemUsersTab';
import ExternalUsersTab from './ExternalUsersTab';
import TeamMemberList from './TeamMemberList';
import { useTeamMemberOperations } from '../team/hooks/useTeamMemberOperations';
import { useSystemUsers } from '@/hooks/project-form/useSystemUsers';

interface TeamSectionProps {
  teamMembers: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (memberId: string, field: keyof TeamMember, value: string) => void;
  removeTeamMember: (memberId: string) => void;
  projectId?: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  teamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  projectId
}) => {
  const [activeTab, setActiveTab] = useState<'system' | 'external'>('system');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  
  // Get users from the system
  const { users, isLoading } = useSystemUsers();
  
  // Use team member operations
  const { 
    addTeamMember: addProjectTeamMember,
    isSubmitting 
  } = useTeamMemberOperations(projectId);

  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };
  
  const handleAddSelectedUsers = async () => {
    if (selectedUsers.length === 0) {
      return;
    }
    
    try {
      // Find the selected users from the users array
      const usersToAdd = users.filter(user => {
        const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        return selectedUsers.includes(userId);
      });
      
      // If using Supabase directly through the hook
      if (projectId) {
        for (const user of usersToAdd) {
          // Default project role is "Team Member" - not related to the system role
          const projectRole = "Team Member";
          
          const success = await addProjectTeamMember({
            name: user.name,
            role: projectRole,
            email: user.email,
            user_id: String(user.id)
          });
          
          if (!success) {
            console.error(`Failed to add ${user.name} to project`);
          }
        }
      } else {
        // Add each selected user as a team member (local state)
        usersToAdd.forEach(user => {
          const newMember: TeamMember = {
            id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: user.name,
            role: 'Team Member',
            email: user.email
          };
          
          addTeamMember(newMember);
        });
      }
      
      // Clear selection
      setSelectedUsers([]);
      toast.success("Team members added", {
        description: `Successfully added ${usersToAdd.length} team member(s)`
      });
    } catch (error) {
      console.error('Error adding team members:', error);
      toast.error("Failed to add team members", {
        description: "An error occurred while adding team members"
      });
    }
  };
  
  const handleInviteExternal = async () => {
    if (!inviteEmail || !inviteRole) {
      return;
    }
    
    try {
      // If using Supabase directly
      if (projectId) {
        const success = await addProjectTeamMember({
          name: inviteEmail.split('@')[0],
          role: inviteRole,
          email: inviteEmail
        });
        
        if (success) {
          // Clear form
          setInviteEmail('');
          setInviteRole('');
          toast.success("External user invited", {
            description: `Successfully invited ${inviteEmail}`
          });
        } else {
          toast.error("Failed to invite user", {
            description: "An error occurred while inviting the external user"
          });
        }
      } else {
        // Local state for project creation form
        const newMember: TeamMember = {
          id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: inviteEmail.split('@')[0],
          role: inviteRole,
          email: inviteEmail
        };
        
        addTeamMember(newMember);
        
        // Clear form
        setInviteEmail('');
        setInviteRole('');
      }
    } catch (error) {
      console.error('Error inviting external user:', error);
      toast.error("Failed to invite external user", {
        description: "An error occurred while inviting the external user"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Team</h3>
      </div>
      
      <Tabs defaultValue="system" value={activeTab} onValueChange={(value) => setActiveTab(value as 'system' | 'external')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="system">System Users</TabsTrigger>
          <TabsTrigger value="external">Invite External</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system" className="space-y-4">
          <SystemUsersTab 
            users={users}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedUsers={selectedUsers}
            handleUserSelection={handleUserSelection}
            handleAddSelectedUsers={handleAddSelectedUsers}
            isSubmitting={isSubmitting}
          />
        </TabsContent>
        
        <TabsContent value="external" className="space-y-4">
          <ExternalUsersTab 
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            inviteRole={inviteRole}
            setInviteRole={setInviteRole}
            handleInviteExternal={handleInviteExternal}
            isSubmitting={isSubmitting}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <h4 className="font-medium mb-3">Current Team Members</h4>
        <TeamMemberList 
          teamMembers={teamMembers}
          updateTeamMember={updateTeamMember}
          removeTeamMember={removeTeamMember}
        />
      </div>
    </div>
  );
};

export default TeamSection;
