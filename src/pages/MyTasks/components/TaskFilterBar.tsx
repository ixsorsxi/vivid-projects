
import React from 'react';
import { Filter, Search, ArrowUpDown, Calendar, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FadeIn from '@/components/animations/FadeIn';

interface TaskFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: string | null) => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'status') => void;
  onAddTask: () => void;
}

const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  setFilterPriority,
  setSortBy,
  onAddTask,
}) => {
  return (
    <FadeIn duration={800}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilterPriority('high')}>
                  <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                  High Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('medium')}>
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                  Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('low')}>
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Low Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority(null)}>
                  Clear Priority Filter
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setSortBy('dueDate')}>
                <Calendar className="h-4 w-4 mr-2" />
                Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('priority')}>
                <Tag className="h-4 w-4 mr-2" />
                Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('status')}>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button size="sm" className="h-10 gap-2" onClick={onAddTask}>
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
    </FadeIn>
  );
};

export default TaskFilterBar;
