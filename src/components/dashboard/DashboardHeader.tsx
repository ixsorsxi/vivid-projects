
import React from 'react';
import { Calendar, ChevronDown, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FadeIn from '../animations/FadeIn';
import NewProjectModal from '../projects/NewProjectModal';
import { useAuth } from '@/context/auth';
import { Badge } from '@/components/ui/badge';

export const DashboardHeader = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';
  
  return (
    <div className="mb-8">
      <FadeIn duration={800}>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {firstName}! Here's an overview of your projects.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Status
                  <Badge variant="outline" className="ml-auto">All</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Priority
                  <Badge variant="outline" className="ml-auto">Any</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Due Date
                  <Badge variant="outline" className="ml-auto">Any</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Assignee
                  <Badge variant="outline" className="ml-auto">All</Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center gap-1 p-1 border rounded-md">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
            
            <NewProjectModal />
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default DashboardHeader;
