
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, BarChart } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar.custom';

const TeamActivity: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div>Completed Tasks</div>
        <Badge variant="outline" size="sm">This week</Badge>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar name="John Doe" size="sm" />
          <div className="flex-1">
            <div className="text-sm font-medium">Task completed: Website Mockups</div>
            <div className="text-xs text-muted-foreground">2 hours ago</div>
          </div>
          <div className="bg-green-500/10 text-green-500 rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Avatar name="Jane Smith" size="sm" />
          <div className="flex-1">
            <div className="text-sm font-medium">Task completed: User Flow Diagrams</div>
            <div className="text-xs text-muted-foreground">Yesterday</div>
          </div>
          <div className="bg-green-500/10 text-green-500 rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Avatar name="Robert Johnson" size="sm" />
          <div className="flex-1">
            <div className="text-sm font-medium">Task completed: API Integration</div>
            <div className="text-xs text-muted-foreground">2 days ago</div>
          </div>
          <div className="bg-green-500/10 text-green-500 rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Avatar name="Emily Davis" size="sm" />
          <div className="flex-1">
            <div className="text-sm font-medium">Task completed: Client Meeting</div>
            <div className="text-xs text-muted-foreground">3 days ago</div>
          </div>
          <div className="bg-green-500/10 text-green-500 rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        </div>
      </div>
      
      <Button variant="outline" className="w-full" size="sm">
        <BarChart className="h-4 w-4 mr-2" />
        View All Activity
      </Button>
    </div>
  );
};

export default TeamActivity;
