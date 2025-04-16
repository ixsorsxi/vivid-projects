
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth';
import { fetchUserProjects } from '@/api/projects';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast-wrapper';
import { Badge } from '@/components/ui/badge';
import ProjectFilterTabs from '@/components/projects/ProjectFilterTabs';
import NewProjectModal from '@/components/projects/NewProjectModal';

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Fetch user projects from Supabase
  const { data: userProjects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        console.log("Fetching projects for user:", user.id);
        const projects = await fetchUserProjects(user.id);
        console.log("Fetched projects successfully:", projects);
        return projects;
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects", {
          description: error?.message || "An unexpected error occurred"
        });
        return [];
      }
    },
    enabled: !!user?.id && isAuthenticated,
  });

  // Initial fetch when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      refetch();
    }
  }, [isAuthenticated, user, refetch]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and organize your team projects</p>
        </div>
        <NewProjectModal />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-span-1 flex justify-end">
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading projects...</span>
        </div>
      ) : (
        <ProjectFilterTabs 
          filteredProjects={userProjects || []} 
          setFilterStatus={setFilterStatus}
          isLoading={isLoading}
          refetchProjects={refetch}
        />
      )}
    </div>
  );
};

export default Projects;
