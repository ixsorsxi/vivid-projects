
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, CheckCircle, Clock, Users } from 'lucide-react';
import { DashboardStatsCardsProps } from './DashboardStatsCardsProps';

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  activeProjects,
  completedTasks,
  teamMembers = []
}) => {
  // Calculate the number of overdue tasks
  const calculateOverdueTasks = () => {
    const now = new Date();
    return completedTasks.filter(task => {
      if (!task.due_date && !task.dueDate) return false;
      const dueDate = task.due_date ? new Date(task.due_date) : 
                     task.dueDate ? new Date(task.dueDate) : null;
      if (!dueDate) return false;
      return dueDate < now && !task.completed;
    }).length;
  };

  const stats = [
    {
      title: 'Active Projects',
      value: activeProjects.length,
      change: '+5%',
      icon: <Activity className="h-5 w-5 text-blue-500" />,
    },
    {
      title: 'Completed Tasks',
      value: completedTasks.filter(task => task.completed).length,
      change: '+12%',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      title: 'Overdue Tasks',
      value: calculateOverdueTasks(),
      change: '-3%',
      icon: <Clock className="h-5 w-5 text-amber-500" />,
    },
    {
      title: 'Team Members',
      value: teamMembers.length,
      change: '+1',
      icon: <Users className="h-5 w-5 text-purple-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div className="mt-2 text-xs font-medium">
              <span className={`${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>{' '}
              from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStatsCards;
