
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMember } from '@/hooks/project-form/types';
import { useSystemUsers } from '@/hooks/project-form/useSystemUsers';
import SystemUsersTab from './team-section/SystemUsersTab';
import ExternalUsersTab from './team-section/ExternalUsersTab';
import TeamMemberList from './team-section/TeamMemberList';

interface TeamSectionProps {
  teamMembers: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (memberId: string, field: keyof TeamMember, value: string) => void;
  removeTeamMember: (memberId: string) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  teamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
}) => {
  const [activeTab, setActiveTab] = useState<'system' | 'external'>('system');
  const [searchQuery, setSearchQuery] = useState('');
  const { users, isLoading } = useSystemUsers();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');

  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };
  
  const handleAddSelectedUsers = () => {
    if (selectedUsers.length === 0) return;
    
    // Find the selected users from the users array
    const usersToAdd = users.filter(user => {
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      return selectedUsers.includes(userId);
    });
    
    // Add each selected user as a team member
    usersToAdd.forEach(user => {
      const newMember: TeamMember = {
        id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: user.name,
        role: user.role || 'Team Member',
        email: user.email
      };
      
      addTeamMember(newMember);
    });
    
    // Clear selection
    setSelectedUsers([]);
  };
  
  const handleInviteExternal = () => {
    if (!inviteEmail || !inviteRole) return;
    
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
          />
        </TabsContent>
        
        <TabsContent value="external" className="space-y-4">
          <ExternalUsersTab 
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            inviteRole={inviteRole}
            setInviteRole={setInviteRole}
            handleInviteExternal={handleInviteExternal}
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
