
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart,
  Check,
  Download, 
  Filter, 
  MoreHorizontal, 
  PlusCircle, 
  Search, 
  UserPlus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const Team = () => {
  const teamMembers = [
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
  
  const departments = [
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  className="pl-9" 
                  placeholder="Search team members..." 
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Add Member</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Members</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Tasks</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          name={member.name} 
                          size="md" 
                          status={member.status === 'active' ? 'online' : 'offline'} 
                        />
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">{member.role}</td>
                    <td className="py-3 px-4 text-sm">{member.department}</td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">{member.location}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 w-32">
                        <div className="flex justify-between text-xs">
                          <span>{member.tasksCompleted}/{member.tasks}</span>
                          <span className="text-muted-foreground">{Math.round((member.tasksCompleted / member.tasks) * 100)}%</span>
                        </div>
                        <Progress value={(member.tasksCompleted / member.tasks) * 100} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={member.status === 'active' ? 'success' : 'outline'} 
                        size="sm"
                      >
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Departments</h3>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      {dept.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{dept.name}</div>
                      <div className="text-xs text-muted-foreground">{dept.members} members</div>
                    </div>
                  </div>
                  <div className="text-sm text-right">
                    <div>Team Lead</div>
                    <div className="font-medium">{dept.lead}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Team Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div>Completed Tasks</div>
                <Badge variant="outline" size="sm">This week</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar name="John Doe" size="sm" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Task completed: Website Mockups</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                  <div className="bg-green-500/10 text-green-500 rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Avatar name="Jane Smith" size="sm" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Task completed: User Flow Diagrams</div>
                    <div className="text-xs text-muted-foreground">Yesterday</div>
                  </div>
                  <div className="bg-green-500/10 text-green-500 rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Avatar name="Robert Johnson" size="sm" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Task completed: API Integration</div>
                    <div className="text-xs text-muted-foreground">2 days ago</div>
                  </div>
                  <div className="bg-green-500/10 text-green-500 rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Avatar name="Emily Davis" size="sm" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Task completed: Client Meeting</div>
                    <div className="text-xs text-muted-foreground">3 days ago</div>
                  </div>
                  <div className="bg-green-500/10 text-green-500 rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" size="sm">
                <BarChart className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Team;
