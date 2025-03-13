
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import FadeIn from '@/components/animations/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectStats from '@/components/projects/ProjectStats';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectTeam from '@/components/projects/ProjectTeam';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectSettings from '@/components/projects/ProjectSettings';
import { useToast } from '@/hooks/use-toast';
import { useProjectData } from './hooks/useProjectData';
import PageContainer from '@/components/PageContainer';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    projectData,
    projectTasks,
    handleStatusChange,
    handleAddMember,
    handleRemoveMember,
    handleAddTask,
    handleUpdateTaskStatus,
    handleDeleteTask
  } = useProjectData(projectId, toast);

  // Enhanced tab handling with error checking
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
    // Update URL query parameter when tab changes
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', value);
    const newSearch = searchParams.toString();
    navigate(`${location.pathname}?${newSearch}`, { replace: true });
  }, [location.pathname, location.search, navigate]);
  
  // Set active tab based on URL query parameter
  useEffect(() => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const tabParam = queryParams.get('tab');
      if (tabParam && ['overview', 'tasks', 'team', 'files', 'settings'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
      // Fallback to default tab
      setActiveTab('overview');
    }
  }, [location.search]);

  // Validate project ID and handle missing data
  useEffect(() => {
    if (!projectId) {
      console.error('No project ID provided');
      toast({
        title: "Error loading project",
        description: "Could not load project: missing ID",
        variant: "destructive"
      });
      navigate('/projects');
    }
  }, [projectId, navigate, toast]);

  // If project data is completely unavailable, show helpful error message
  if (!projectData.name && projectId) {
    return (
      <PageContainer title="Project Not Found" subtitle="The requested project could not be found">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/projects')}
          >
            Go to Projects
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={projectData.name || ''} subtitle={projectData.description}>
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
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
              teamMembers={projectData.team}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
            />
          </TabsContent>
          
          <TabsContent value="team" className="mt-0">
            <ProjectTeam 
              team={projectData.team}
              onAddMember={(email, role) => {
                handleAddMember(email);
                
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
    </PageContainer>
  );
};

export default ProjectDetail;
