
import React from 'react';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NewProjectModal from '@/components/projects/NewProjectModal';
import FadeIn from '@/components/animations/FadeIn';

interface ProjectFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProjectFilterBar = ({ searchQuery, setSearchQuery }: ProjectFilterBarProps) => {
  return (
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
  );
};

export default ProjectFilterBar;
