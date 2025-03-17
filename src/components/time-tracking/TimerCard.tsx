
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Laptop, Pause, PlusCircle, RefreshCw } from 'lucide-react';

const TimerCard: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium">Current Timer</h3>
          <p className="text-muted-foreground">Track time for your current task</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold tabular-nums">01:15:32</div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600">
              <Pause className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Project</label>
          <Select defaultValue="website">
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website Redesign</SelectItem>
              <SelectItem value="mobile">Mobile App Development</SelectItem>
              <SelectItem value="marketing">Marketing Campaign</SelectItem>
              <SelectItem value="product">Product Launch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Task</label>
          <Select defaultValue="api">
            <SelectTrigger>
              <SelectValue placeholder="Select task" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="api">API Integration</SelectItem>
              <SelectItem value="ui">UI Design</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">Description</label>
          <Input placeholder="What are you working on?" defaultValue="Implementing API authentication" />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Laptop className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Started at 12:30 PM</span>
        </div>
        
        <Button variant="outline" size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Add Time Manually</span>
        </Button>
      </div>
    </Card>
  );
};

export default TimerCard;
