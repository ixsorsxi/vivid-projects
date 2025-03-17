
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart } from 'lucide-react';
import { WeeklySummaryItem } from './types';

interface WeeklySummaryCardProps {
  data: WeeklySummaryItem[];
}

const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ data }) => {
  const totalHoursThisWeek = data.reduce((acc, day) => acc + day.hours, 0);
  
  return (
    <Card className="p-6 md:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Weekly Summary</h3>
        <Badge variant="outline">{totalHoursThisWeek.toFixed(1)} hours total</Badge>
      </div>
      
      <div className="h-64 flex items-end gap-2">
        {data.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-primary/15 rounded-t-sm" style={{ height: `${(day.hours / 10) * 100}%` }}>
              <div className="w-full bg-primary rounded-t-sm" style={{ height: `${(day.hours / 10) * 100}%` }}></div>
            </div>
            <div className="text-xs font-medium">{day.day}</div>
            <div className="text-xs text-muted-foreground">{day.hours}h</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Total this week</div>
          <div className="text-2xl font-bold">{totalHoursThisWeek.toFixed(1)} hours</div>
        </div>
        
        <Button variant="outline" className="gap-2">
          <BarChart className="h-4 w-4" />
          <span>Full Report</span>
        </Button>
      </div>
    </Card>
  );
};

export default WeeklySummaryCard;
