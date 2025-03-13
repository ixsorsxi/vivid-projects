
import React from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { demoProjects } from '@/lib/data';
import NewProjectModal from '@/components/projects/NewProjectModal';
import FadeIn from '@/components/animations/FadeIn';

const Projects = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  
  const filteredProjects = React.useMemo(() => {
    return demoProjects.filter(project => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply status filter
      const matchesStatus = filterStatus === null || project.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filterStatus, demoProjects]);

  return (
    <PageContainer title="Projects" subtitle="Manage and track all your projects">
      <div className="space-y-6">
        <FadeIn duration={800}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="h-10 gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <NewProjectModal buttonClassName="gap-2" />
            </div>
          </div>
        </FadeIn>
        
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium">No projects found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters, or create a new project.
                    </p>
                    <NewProjectModal buttonClassName="mt-4" />
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* The same content will be shown for all tabs, with filtering done via state */}
            <TabsContent value="in-progress" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium">No in-progress projects found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or create a new project.
                    </p>
                    <NewProjectModal buttonClassName="mt-4" />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="not-started" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium">No not-started projects found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or create a new project.
                    </p>
                    <NewProjectModal buttonClassName="mt-4" />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium">No completed projects found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or create a new project.
                    </p>
                    <NewProjectModal buttonClassName="mt-4" />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="on-hold" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium">No on-hold projects found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or create a new project.
                    </p>
                    <NewProjectModal buttonClassName="mt-4" />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </PageContainer>
  );
};

export default Projects;
