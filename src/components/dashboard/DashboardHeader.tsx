
import React from 'react';
import { Calendar, ChevronDown, Filter, List, PlusCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FadeIn from '../animations/FadeIn';

export const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <FadeIn duration={800}>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your projects.
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
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Status</DropdownMenuItem>
                <DropdownMenuItem>Priority</DropdownMenuItem>
                <DropdownMenuItem>Due Date</DropdownMenuItem>
                <DropdownMenuItem>Assignee</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center gap-1 p-1 border rounded-md">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
            
            <Button size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Create Project</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-base">Active Projects</h3>
              <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium px-2.5 py-0.5">
                12 Projects
              </span>
            </div>
            <p className="text-3xl font-bold mt-2">86%</p>
            <p className="text-muted-foreground text-sm mt-1">+2.5% from last month</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-base">Completed Tasks</h3>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium px-2.5 py-0.5">
                64 Tasks
              </span>
            </div>
            <p className="text-3xl font-bold mt-2">52%</p>
            <p className="text-muted-foreground text-sm mt-1">+4.3% from last week</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-base">Team Members</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <User className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex -space-x-2 mt-4">
              <Avatar name="John Doe" size="md" className="ring-2 ring-background" />
              <Avatar name="Jane Smith" size="md" className="ring-2 ring-background" />
              <Avatar name="Robert Johnson" size="md" className="ring-2 ring-background" />
              <Avatar name="Emily Davis" size="md" className="ring-2 ring-background" />
              <Avatar name="Michael Brown" size="md" className="ring-2 ring-background" />
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-medium ring-2 ring-background">
                +3
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default DashboardHeader;
