import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Calendar, Clock, Tag, User, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import FadeIn from '@/components/animations/FadeIn';
import { demoTasks } from '@/lib/data';
import TasksSection from '@/components/projects/TasksSection';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const projectName = projectId?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  const projectData = {
    name: projectName,
    description: "This is a sample project description that explains the goals and objectives of this project.",
    status: "in-progress",
    dueDate: "2025-05-15",
    category: "Development",
    progress: 35,
    tasks: {
      total: 24,
      completed: 8,
      inProgress: 12,
      notStarted: 4
    },
    team: [
      { id: 1, name: "John Doe", role: "Project Manager" },
      { id: 2, name: "Jane Smith", role: "Lead Developer" },
      { id: 3, name: "Mike Johnson", role: "Designer" },
      { id: 4, name: "Sarah Williams", role: "QA Engineer" }
    ]
  };

  const projectTasks = demoTasks.filter(task => task.project === projectData.name);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 transition-all duration-300">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 md:p-8">
          <FadeIn duration={800}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">{projectData.name}</h1>
                  <Badge variant={projectData.status === 'completed' ? 'success' : 'default'}>
                    {projectData.status === 'in-progress' ? 'In Progress' : 
                     projectData.status === 'completed' ? 'Completed' : 'Not Started'}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">{projectData.description}</p>
              </div>
              
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
                <Button variant="default" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-5 rounded-xl flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{projectData.dueDate}</p>
                </div>
              </div>
              
              <div className="glass-card p-5 rounded-xl flex items-center gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                  <Tag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{projectData.category}</p>
                </div>
              </div>
              
              <div className="glass-card p-5 rounded-xl flex items-center gap-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{width: `${projectData.progress}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{projectData.progress}%</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-5 rounded-xl flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasks</p>
                  <p className="font-medium">
                    {projectData.tasks.completed}/{projectData.tasks.total} Completed
                  </p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <div className="glass-card p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
                  <p className="text-muted-foreground">
                    This page is currently under development. In a real application, it would show 
                    project metrics, recent activity, upcoming deadlines, and other relevant information.
                  </p>
                  
                  <div className="mt-6 p-5 border border-dashed rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium">More data coming soon</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        This project is being set up. Check back later for updates.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0">
                <TasksSection projectId={projectId || ''} tasks={projectTasks} />
              </TabsContent>
              
              <TabsContent value="team" className="mt-0">
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Team Members</h2>
                    <Button size="sm">Invite Member</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectData.team.map(member => (
                      <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="files" className="mt-0">
                <div className="glass-card p-6 rounded-xl flex items-center justify-center h-64">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-medium">No files yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload project documents, designs, and other files here.
                    </p>
                    <Button variant="outline" className="mt-4">Upload Files</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <div className="glass-card p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Project Settings</h2>
                  <p className="text-muted-foreground mb-6">
                    Manage project configuration, permissions, and other settings.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="font-medium mb-2">Project Visibility</h3>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="rounded-full">Private</Button>
                        <Button variant="ghost" size="sm" className="rounded-full">Public</Button>
                      </div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-medium mb-2">Notification Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Email notifications</span>
                          <Button variant="ghost" size="sm">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Task reminders</span>
                          <Button variant="ghost" size="sm">Configure</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2 text-red-500 dark:text-red-400">Danger Zone</h3>
                      <Button variant="destructive" size="sm">Delete Project</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </FadeIn>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
