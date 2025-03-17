
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/auth';
import RoleManagement from '@/components/admin/RoleManagement';

const AdminPanel = () => {
  const { isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return (
    <AdminLayout title="Admin Panel" currentTab="dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your application and users.</p>
        </div>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="grid grid-cols-5 max-w-xl mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg border shadow-sm p-4">
                <h3 className="font-medium mb-2">Total Users</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-card rounded-lg border shadow-sm p-4">
                <h3 className="font-medium mb-2">Active Projects</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-card rounded-lg border shadow-sm p-4">
                <h3 className="font-medium mb-2">Total Tasks</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <p className="text-muted-foreground">User management will be integrated with Supabase.</p>
          </TabsContent>
          
          <TabsContent value="roles">
            <RoleManagement />
          </TabsContent>
          
          <TabsContent value="settings">
            <p className="text-muted-foreground">Admin settings will be integrated with Supabase.</p>
          </TabsContent>
          
          <TabsContent value="logs">
            <p className="text-muted-foreground">System logs will be integrated with Supabase.</p>
          </TabsContent>
        </Tabs>
        
        <Outlet />
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
