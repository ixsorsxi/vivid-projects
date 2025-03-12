
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import FadeIn from '@/components/animations/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { demoTasks } from '@/lib/data';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectStats from '@/components/projects/ProjectStats';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectTeam from '@/components/projects/ProjectTeam';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectSettings from '@/components/projects/ProjectSettings';
import { useToast } from '@/hooks/use-toast';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { toast } = useToast();
  
  const projectName = projectId?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  // Add state for project data
  const [projectData, setProjectData] = React.useState({
    name: projectName,
    description: "This is a sample project description that explains the goals and objectives of this project.",
    status: "in-progress" as 'not-started' | 'in-progress' | 'on-hold' | 'completed',
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
  });

  // Add state for tasks
  const [projectTasks, setProjectTasks] = React.useState(
    demoTasks.filter(task => task.project === projectData.name)
  );

  // Handler to update project status
  const handleStatusChange = (newStatus: string) => {
    setProjectData(prev => ({
      ...prev,
      status: newStatus as 'not-started' | 'in-progress' | 'on-hold' | 'completed'
    }));

    toast({
      title: "Project status updated",
      description: `Project has been marked as ${newStatus === 'completed' ? 'complete' : 'in progress'}`,
    });
  };

  // Handler to add members to the team
  const handleAddMember = (email: string) => {
    const newMember = {
      id: Date.now(),
      name: email.split('@')[0],
      role: "Team Member"
    };

    setProjectData(prev => ({
      ...prev,
      team: [...prev.team, newMember]
    }));

    toast({
      title: "Team member added",
      description: `Invitation sent to ${email}`,
    });
  };

  // Handler to remove team members
  const handleRemoveMember = (memberId: number) => {
    setProjectData(prev => ({
      ...prev,
      team: prev.team.filter(member => member.id !== memberId)
    }));

    toast({
      title: "Team member removed",
      description: "The team member has been removed from this project",
    });
  };

  // Handler to add a new task
  const handleAddTask = (task: any) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...task,
      assignees: [],
      completed: task.status === 'completed'
    };

    setProjectTasks(prev => [...prev, newTask]);
    
    // Update project task counts
    updateTaskCounts();

    toast({
      title: "Task created",
      description: "New task has been added to the project",
    });
  };

  // Handler to update task status
  const handleUpdateTaskStatus = (taskId: string, newStatus: string) => {
    setProjectTasks(prev => 
      prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: newStatus,
            completed: newStatus === 'completed'
          };
        }
        return task;
      })
    );
    
    // Update project task counts
    updateTaskCounts();

    toast({
      title: "Task updated",
      description: `Task status changed to ${newStatus}`,
    });
  };

  // Handler to delete a task
  const handleDeleteTask = (taskId: string) => {
    setProjectTasks(prev => prev.filter(task => task.id !== taskId));
    
    // Update project task counts
    updateTaskCounts();

    toast({
      title: "Task deleted",
      description: "Task has been removed from the project",
    });
  };

  // Update task counts
  const updateTaskCounts = () => {
    setTimeout(() => {
      const completed = projectTasks.filter(task => task.status === 'completed').length;
      const inProgress = projectTasks.filter(task => task.status === 'in-progress').length;
      const notStarted = projectTasks.filter(task => task.status === 'to-do').length;
      const total = completed + inProgress + notStarted;
      
      // Calculate progress percentage
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      setProjectData(prev => ({
        ...prev,
        progress,
        tasks: {
          total,
          completed,
          inProgress,
          notStarted
        }
      }));
    }, 0);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 transition-all duration-300">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 md:p-8">
          <FadeIn duration={800}>
            <ProjectHeader 
              projectName={projectData.name || ''} 
              projectStatus={projectData.status} 
              projectDescription={projectData.description}
              onStatusChange={handleStatusChange}
              onAddMember={handleAddMember}
            />
            
            <ProjectStats 
              dueDate={projectData.dueDate}
              category={projectData.category}
              progress={projectData.progress}
              tasks={{
                total: projectData.tasks.total,
                completed: projectData.tasks.completed
              }}
            />
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <ProjectOverview />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0">
                <TasksSection 
                  projectId={projectId || ''} 
                  tasks={projectTasks}
                  onAddTask={handleAddTask}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onDeleteTask={handleDeleteTask}
                />
              </TabsContent>
              
              <TabsContent value="team" className="mt-0">
                <ProjectTeam 
                  team={projectData.team}
                  onAddMember={(email, role) => {
                    const newMember = {
                      id: Date.now(),
                      name: email.split('@')[0],
                      role: role
                    };
                    
                    setProjectData(prev => ({
                      ...prev,
                      team: [...prev.team, newMember]
                    }));
                    
                    toast({
                      title: "Team member invited",
                      description: `Invitation sent to ${email} for the role of ${role}`,
                    });
                  }}
                  onRemoveMember={handleRemoveMember}
                />
              </TabsContent>
              
              <TabsContent value="files" className="mt-0">
                <ProjectFiles />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <ProjectSettings />
              </TabsContent>
            </Tabs>
          </FadeIn>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
