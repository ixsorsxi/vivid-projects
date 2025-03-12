
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/AdminLayout';
import { Users, Calendar, FileText, Activity, BarChart, TrendingUp, ClipboardCheck, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '145', icon: Users, change: '+12%', changeType: 'positive' },
    { title: 'Projects', value: '32', icon: FileText, change: '+8%', changeType: 'positive' },
    { title: 'Tasks Completed', value: '543', icon: ClipboardCheck, change: '+24%', changeType: 'positive' },
    { title: 'System Uptime', value: '99.9%', icon: Activity, change: '-0.1%', changeType: 'negative' },
  ];

  const recentActivities = [
    { message: 'New user registered', time: '2 hours ago', icon: Users },
    { message: 'Project "Marketing Campaign" created', time: '4 hours ago', icon: FileText },
    { message: 'System update completed', time: '1 day ago', icon: Activity },
    { message: '15 tasks marked as completed', time: '2 days ago', icon: ClipboardCheck },
    { message: 'Backup completed successfully', time: '3 days ago', icon: Calendar },
  ];

  return (
    <AdminLayout title="Admin Dashboard" currentTab="">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-background to-muted/30 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">Welcome back, Admin</h2>
                <p className="text-muted-foreground">Here's an overview of your system</p>
              </div>
              <div className="flex space-x-4">
                <Card className="bg-secondary/50 shadow-sm border-none">
                  <CardContent className="p-3 flex gap-2 items-center">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">System healthy</span>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/50 shadow-sm border-none">
                  <CardContent className="p-3 flex gap-2 items-center">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Updated just now</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-lift border-none shadow-md overflow-hidden">
              <div className="absolute h-full w-1.5 left-0 top-0 bg-primary/80"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-foreground/70" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {stat.change}
                  <span className="ml-1 text-muted-foreground">from last month</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Overview */}
          <Card className="lg:col-span-3 border-none shadow-md">
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Key performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span className="font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span className="font-medium">32%</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Disk Space</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Network</span>
                  <span className="font-medium">62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              
              <div className="pt-4 grid grid-cols-2 gap-4">
                <Card className="bg-secondary/30 border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">Active Sessions</div>
                    <div className="text-2xl font-bold mt-1">24</div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/30 border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">Server Nodes</div>
                    <div className="text-2xl font-bold mt-1">4</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
