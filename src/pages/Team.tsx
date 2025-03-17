
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Card } from '@/components/ui/card';
import TeamSearchBar from '@/components/team/TeamSearchBar';
import TeamTabs from '@/components/team/TeamTabs';
import TeamMemberTable from '@/components/team/TeamMemberTable';
import DepartmentList from '@/components/team/DepartmentList';
import TeamActivity from '@/components/team/TeamActivity';
import { TeamMember, Department } from '@/components/team/types';

const Team = () => {
  const teamMembers: TeamMember[] = [
    { 
      id: '1', 
      name: 'John Doe', 
      role: 'Frontend Developer',
      email: 'john.doe@example.com',
      tasks: 12,
      tasksCompleted: 8,
      status: 'active',
      availability: 'full-time',
      location: 'New York, USA',
      department: 'Engineering',
      joinedDate: 'Jan 15, 2022',
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      role: 'UI/UX Designer',
      email: 'jane.smith@example.com',
      tasks: 8,
      tasksCompleted: 5,
      status: 'active',
      availability: 'full-time',
      location: 'London, UK',
      department: 'Design',
      joinedDate: 'Mar 3, 2022',
    },
    { 
      id: '3', 
      name: 'Robert Johnson', 
      role: 'Backend Developer',
      email: 'robert.johnson@example.com',
      tasks: 15,
      tasksCompleted: 11,
      status: 'active',
      availability: 'part-time',
      location: 'Berlin, Germany',
      department: 'Engineering',
      joinedDate: 'Feb 10, 2023',
    },
    { 
      id: '4', 
      name: 'Emily Davis', 
      role: 'Project Manager',
      email: 'emily.davis@example.com',
      tasks: 6,
      tasksCompleted: 4,
      status: 'active',
      availability: 'full-time',
      location: 'Toronto, Canada',
      department: 'Management',
      joinedDate: 'Nov 5, 2021',
    },
    { 
      id: '5', 
      name: 'Michael Brown', 
      role: 'QA Engineer',
      email: 'michael.brown@example.com',
      tasks: 9,
      tasksCompleted: 7,
      status: 'inactive',
      availability: 'contract',
      location: 'Sydney, Australia',
      department: 'Quality Assurance',
      joinedDate: 'Jul 22, 2022',
    },
  ];
  
  const departments: Department[] = [
    { name: 'Engineering', members: 12, lead: 'John Smith' },
    { name: 'Design', members: 8, lead: 'Sarah Johnson' },
    { name: 'Management', members: 5, lead: 'Emily Davis' },
    { name: 'Marketing', members: 7, lead: 'David Wilson' },
    { name: 'Quality Assurance', members: 4, lead: 'Michael Brown' },
  ];
  
  return (
    <PageContainer 
      title="Team" 
      subtitle="Manage team members and departments"
    >
      <div className="space-y-6">
        <Card className="p-6">
          <TeamSearchBar />
          
          <TeamTabs>
            <TeamMemberTable teamMembers={teamMembers} />
          </TeamTabs>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Departments</h3>
            <DepartmentList departments={departments} />
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Team Activity</h3>
            <TeamActivity />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Team;
