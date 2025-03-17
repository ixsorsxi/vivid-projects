
import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeFilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  onStatusChange: (status: string) => void;
}

const TimeFilterBar: React.FC<TimeFilterBarProps> = ({ 
  onSearch, 
  onFilterChange,
  onStatusChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-9 w-full"
          placeholder="Search time entries..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex gap-2 items-center">
        <Select onValueChange={onFilterChange} defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="Website Redesign">Website Redesign</SelectItem>
            <SelectItem value="Mobile App Development">Mobile App Dev</SelectItem>
            <SelectItem value="Marketing Campaign">Marketing</SelectItem>
          </SelectContent>
        </Select>
        
        <Select onValueChange={onStatusChange} defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Additional Filters</h4>
              <div className="space-y-2">
                <h5 className="text-xs font-medium">Date Range</h5>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" className="col-span-1" />
                  <Input type="date" className="col-span-1" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TimeFilterBar;
