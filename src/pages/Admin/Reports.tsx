
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/AdminLayout';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminReports = () => {
  return (
    <AdminLayout title="System Reports" currentTab="reports">
      <div className="space-y-6">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Reports Dashboard</CardTitle>
            <CardDescription>View and generate system reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="usage">
              <TabsList className="mb-4">
                <TabsTrigger value="usage" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  <span>Usage Statistics</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>User Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  <span>System Performance</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="usage" className="space-y-4">
                <Card className="border border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Usage Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                      {/* Placeholder for chart */}
                      <div className="text-center">
                        <LineChart className="h-12 w-12 text-primary mx-auto mb-2 opacity-60" />
                        <p className="text-muted-foreground">Usage data visualization would appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-border/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Total API Calls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">245,769</div>
                      <p className="text-sm text-muted-foreground">+12.5% from last month</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-border/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Average Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">289ms</div>
                      <p className="text-sm text-muted-foreground">-5.3% from last month</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-border/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Error Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">0.42%</div>
                      <p className="text-sm text-muted-foreground">+0.1% from last month</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                <div className="text-center">
                  <BarChart className="h-12 w-12 text-primary mx-auto mb-2 opacity-60" />
                  <p className="text-muted-foreground">User analytics data visualization would appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-primary mx-auto mb-2 opacity-60" />
                  <p className="text-muted-foreground">System performance data visualization would appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
