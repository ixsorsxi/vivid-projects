
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FadeIn from '@/components/animations/FadeIn';
import ProjectsList from '@/components/projects/ProjectsList';
import { ProjectType } from '@/types/project';

interface ProjectFilterTabsProps {
  filteredProjects: ProjectType[];
  setFilterStatus: (status: string | null) => void;
}

const ProjectFilterTabs = ({ filteredProjects, setFilterStatus }: ProjectFilterTabsProps) => {
  return (
    <FadeIn duration={800} delay={100}>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger 
            value="all" 
            onClick={() => setFilterStatus(null)}
          >
            All Projects
          </TabsTrigger>
          <TabsTrigger 
            value="in-progress" 
            onClick={() => setFilterStatus('in-progress')}
          >
            In Progress
          </TabsTrigger>
          <TabsTrigger 
            value="not-started" 
            onClick={() => setFilterStatus('not-started')}
          >
            Not Started
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </TabsTrigger>
          <TabsTrigger 
            value="on-hold" 
            onClick={() => setFilterStatus('on-hold')}
          >
            On Hold
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <ProjectsList 
            projects={filteredProjects} 
            emptyStateMessage="Try adjusting your search or filters, or create a new project."
          />
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          <ProjectsList 
            projects={filteredProjects} 
            emptyStateMessage="Try adjusting your search or create a new project."
          />
        </TabsContent>

        <TabsContent value="not-started" className="mt-6">
          <ProjectsList 
            projects={filteredProjects} 
            emptyStateMessage="Try adjusting your search or create a new project."
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <ProjectsList 
            projects={filteredProjects} 
            emptyStateMessage="Try adjusting your search or create a new project."
          />
        </TabsContent>

        <TabsContent value="on-hold" className="mt-6">
          <ProjectsList 
            projects={filteredProjects} 
            emptyStateMessage="Try adjusting your search or create a new project."
          />
        </TabsContent>
      </Tabs>
    </FadeIn>
  );
};

export default ProjectFilterTabs;
