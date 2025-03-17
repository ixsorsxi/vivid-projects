
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  description: string;
  value: number;
  icon: LucideIcon;
  label: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, description, value, icon: Icon, label }) => {
  const getProgressColor = (value: number) => {
    if (value < 50) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLabelColor = (value: number) => {
    if (value < 50) return 'bg-green-100 text-green-800';
    if (value < 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Icon className="h-4 w-4 mr-2" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{value}%</span>
            <span className={`text-xs rounded-full px-2 py-1 ${getLabelColor(value)}`}>
              {label}
            </span>
          </div>
          <Progress value={value} className={getProgressColor(value)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
