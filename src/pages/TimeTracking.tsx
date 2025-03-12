
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart,
  Calendar, 
  Clock, 
  Download, 
  Filter, 
  Laptop, 
  Pause, 
  Play, 
  PlusCircle, 
  RefreshCw, 
  Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TimeTracking = () => {
  // Mock time entries data
  const timeEntries = [
    { 
      id: '1', 
      task: 'Website Redesign', 
      project: 'Website Redesign',
      date: 'Today',
      startTime: '09:00 AM',
      endTime: '11:30 AM',
      duration: '2h 30m',
      status: 'completed',
      user: 'John Doe',
    },
    { 
      id: '2', 
      task: 'API Integration', 
      project: 'Mobile App Development',
      date: 'Today',
      startTime: '12:30 PM',
      endTime: 'Running',
      duration: '1h 15m',
      status: 'running',
      user: 'John Doe',
    },
    { 
      id: '3', 
      task: 'UI Design Review', 
      project: 'Website Redesign',
      date: 'Yesterday',
      startTime: '02:00 PM',
      endTime: '04:15 PM',
      duration: '2h 15m',
      status: 'completed',
      user: 'Jane Smith',
    },
    { 
      id: '4', 
      task: 'Client Meeting', 
      project: 'Marketing Campaign',
      date: 'Yesterday',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      duration: '1h 0m',
      status: 'completed',
      user: 'Emily Davis',
    },
    { 
      id: '5', 
      task: 'Database Optimization', 
      project: 'Website Redesign',
      date: '2 days ago',
      startTime: '03:00 PM',
      endTime: '06:30 PM',
      duration: '3h 30m',
      status: 'completed',
      user: 'Robert Johnson',
    },
  ];
  
  // Weekly summary data
  const weeklySummary = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 7.2 },
    { day: 'Wed', hours: 9.0 },
    { day: 'Thu', hours: 6.5 },
    { day: 'Fri', hours: 5.0 },
    { day: 'Sat', hours: 2.0 },
    { day: 'Sun', hours: 0 },
  ];
  
  // Project hours data
  const projectHours = [
    { project: 'Website Redesign', hours: 24.5, color: 'bg-blue-500' },
    { project: 'Mobile App Development', hours: 12.0, color: 'bg-green-500' },
    { project: 'Marketing Campaign', hours: 8.5, color: 'bg-purple-500' },
    { project: 'Product Launch', hours: 3.0, color: 'bg-amber-500' },
  ];
  
  const totalHoursThisWeek = weeklySummary.reduce((acc, day) => acc + day.hours, 0);
  
  return (
    <PageContainer 
      title="Time Tracking" 
      subtitle="Monitor and manage working hours"
    >
      <div className="space-y-6">
        {/* Timer card */}
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
        
        {/* Time entries card */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-medium">Time Entries</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  className="pl-9 w-48 sm:w-64" 
                  placeholder="Search entries..." 
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>This Week</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Today</DropdownMenuItem>
                  <DropdownMenuItem>Yesterday</DropdownMenuItem>
                  <DropdownMenuItem>This Week</DropdownMenuItem>
                  <DropdownMenuItem>Last Week</DropdownMenuItem>
                  <DropdownMenuItem>This Month</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Custom Range</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Entries</TabsTrigger>
              <TabsTrigger value="my">My Entries</TabsTrigger>
              <TabsTrigger value="running">Running</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm">Task</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Project</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Start</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">End</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">User</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {timeEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{entry.task}</td>
                    <td className="py-3 px-4 text-muted-foreground">{entry.project}</td>
                    <td className="py-3 px-4 text-sm">{entry.date}</td>
                    <td className="py-3 px-4 text-sm">{entry.startTime}</td>
                    <td className="py-3 px-4 text-sm">
                      {entry.status === 'running' ? (
                        <span className="flex items-center gap-1 text-green-500">
                          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                          Running
                        </span>
                      ) : entry.endTime}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium tabular-nums">{entry.duration}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={entry.user} size="xs" />
                        <span className="text-sm">{entry.user}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={entry.status === 'running' ? 'primary' : 'outline'} 
                        size="sm"
                      >
                        {entry.status === 'running' ? 'Active' : 'Completed'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing 5 of 52 entries
          </div>
        </Card>
        
        {/* Analytics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Weekly Summary</h3>
              <Badge variant="outline">38.2 hours total</Badge>
            </div>
            
            <div className="h-64 flex items-end gap-2">
              {weeklySummary.map((day, index) => (
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
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-6">Hours by Project</h3>
            
            <div className="space-y-4">
              {projectHours.map((project, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm">{project.project}</div>
                    <div className="text-sm font-medium">{project.hours}h</div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div className={`h-2 ${project.color} rounded-full`} style={{ width: `${(project.hours / 30) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground mb-1">This month</div>
              <div className="text-2xl font-bold">
                {projectHours.reduce((acc, project) => acc + project.hours, 0).toFixed(1)} hours
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                across {projectHours.length} projects
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default TimeTracking;
