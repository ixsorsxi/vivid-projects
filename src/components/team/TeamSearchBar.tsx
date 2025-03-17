
import React from 'react';
import { Search, Filter, Download, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const TeamSearchBar: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            className="pl-9" 
            placeholder="Search team members..." 
          />
        </div>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
        
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Add Member</span>
        </Button>
      </div>
    </div>
  );
};

export default TeamSearchBar;
