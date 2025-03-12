
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/AdminLayout';
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotificationItem = ({ 
  title, 
  time, 
  description, 
  type = 'info',
  read = false
}: { 
  title: string; 
  time: string; 
  description: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  read?: boolean;
}) => {
  const [isRead, setIsRead] = useState(read);
  
  const icons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />
  };

  return (
    <div className={`p-4 border-b border-border/40 flex gap-4 ${isRead ? 'bg-background' : 'bg-primary/5'}`}>
      <div className="mt-0.5">
        {icons[type]}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{title}</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{time}</span>
            {!isRead && (
              <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary-foreground">New</Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div>
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => setIsRead(!isRead)}
          className="text-xs"
        >
          {isRead ? "Mark unread" : "Mark read"}
        </Button>
      </div>
    </div>
  );
};

const AdminNotifications = () => {
  return (
    <AdminLayout title="Notifications" currentTab="notifications">
      <div className="space-y-6">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Manage and view system notifications</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="notifications" defaultChecked />
                <label htmlFor="notifications" className="text-sm">Enable notifications</label>
              </div>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark all as read</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="border rounded-md bg-card">
                <div className="divide-y divide-border/40">
                  <NotificationItem 
                    title="System update available" 
                    time="Just now" 
                    description="A new system update (v2.1.0) is available. Click to view details." 
                    type="info"
                  />
                  <NotificationItem 
                    title="Unusual login activity detected" 
                    time="2 hours ago" 
                    description="Multiple login attempts from unknown IP address 192.168.1.1" 
                    type="warning"
                  />
                  <NotificationItem 
                    title="Backup completed successfully" 
                    time="Yesterday at 11:45 PM" 
                    description="Full system backup has been completed and stored securely." 
                    type="success"
                    read={true}
                  />
                  <NotificationItem 
                    title="Database connection error" 
                    time="2 days ago" 
                    description="The system encountered an error connecting to the primary database." 
                    type="error"
                    read={true}
                  />
                  <NotificationItem 
                    title="New user registered" 
                    time="3 days ago" 
                    description="A new admin user 'sarah.johnson' has been created in the system." 
                    type="info"
                    read={true}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="system" className="border rounded-md bg-card">
                <div className="divide-y divide-border/40">
                  <NotificationItem 
                    title="System update available" 
                    time="Just now" 
                    description="A new system update (v2.1.0) is available. Click to view details." 
                    type="info"
                  />
                  <NotificationItem 
                    title="Backup completed successfully" 
                    time="Yesterday at 11:45 PM" 
                    description="Full system backup has been completed and stored securely." 
                    type="success"
                    read={true}
                  />
                  <NotificationItem 
                    title="Database connection error" 
                    time="2 days ago" 
                    description="The system encountered an error connecting to the primary database." 
                    type="error"
                    read={true}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="border rounded-md bg-card">
                <div className="divide-y divide-border/40">
                  <NotificationItem 
                    title="Unusual login activity detected" 
                    time="2 hours ago" 
                    description="Multiple login attempts from unknown IP address 192.168.1.1" 
                    type="warning"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="updates" className="border rounded-md bg-card">
                <div className="divide-y divide-border/40">
                  <NotificationItem 
                    title="System update available" 
                    time="Just now" 
                    description="A new system update (v2.1.0) is available. Click to view details." 
                    type="info"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
