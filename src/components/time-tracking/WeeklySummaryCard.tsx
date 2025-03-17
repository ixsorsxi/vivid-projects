
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { WeeklySummaryItem } from './types';

interface WeeklySummaryCardProps {
  data: WeeklySummaryItem[];
}

const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ data }) => {
  const totalHours = data.reduce((sum, day) => sum + day.hours, 0);
  const averageHours = totalHours / data.filter(day => day.hours > 0).length || 0;
  
  // Get current day of week
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 border rounded-md shadow-sm">
          <p className="font-medium">{`${payload[0].payload.day}: ${payload[0].value.toFixed(1)} hours`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Prepare data with opacity information to avoid the type error
  const dataWithOpacity = data.map(item => ({
    ...item,
    opacity: item.day.toLowerCase() === today.toLowerCase() ? 1 : 0.6
  }));
  
  return (
    <Card className="p-6 md:col-span-2">
      <h3 className="text-lg font-medium mb-6">Weekly Summary</h3>
      
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataWithOpacity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              hide={true}
              domain={[0, 'dataMax + 2']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="hours" 
              fill="var(--primary)" 
              radius={[4, 4, 0, 0]}
              animationDuration={750}
              // Use the opacity value from our prepared data
              fillOpacity="opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total hours</p>
          <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Daily average</p>
          <p className="text-2xl font-bold">{averageHours.toFixed(1)}</p>
        </div>
      </div>
    </Card>
  );
};

export default WeeklySummaryCard;
