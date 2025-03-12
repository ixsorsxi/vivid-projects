
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/AdminLayout';
import { Users, Calendar, FileText, Activity, BarChart } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '145', icon: Users, change: '+12%', changeType: 'positive' },
    { title: 'Projects', value: '32', icon: FileText, change: '+8%', changeType: 'positive' },
    { title: 'Tasks Completed', value: '543', icon: Calendar, change: '+24%', changeType: 'positive' },
    { title: 'System Uptime', value: '99.9%', icon: Activity, change: '-0.1%', changeType: 'negative' },
  ];

  return (
    <AdminLayout title="Admin Dashboard" currentTab="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {stat.change}
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recent system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Detailed charts with system metrics will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
