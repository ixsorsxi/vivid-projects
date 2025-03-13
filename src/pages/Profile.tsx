import React, { useState } from 'react';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/toast-wrapper';
import { User, Settings, Bell, Shield, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSaveProfile = () => {
    toast("Profile updated", {
      description: "Your profile information has been updated.",
    });
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <PageContainer title="User Profile" subtitle="Manage your account settings and preferences">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-primary/10 rounded-full p-8 text-primary">
                <User size={64} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground mt-1 capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
            
            <div className="mt-8 space-y-2">
              <h4 className="text-sm font-medium mb-3">Account Navigation</h4>
              <a href="#profile" className="flex items-center p-2 rounded-md hover:bg-accent text-sm">
                <User className="mr-2 h-4 w-4" />
                Personal Info
              </a>
              <a href="#settings" className="flex items-center p-2 rounded-md hover:bg-accent text-sm">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </a>
              <a href="#notifications" className="flex items-center p-2 rounded-md hover:bg-accent text-sm">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </a>
              <a href="#security" className="flex items-center p-2 rounded-md hover:bg-accent text-sm">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </a>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your profile information and account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
                <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                
                <Button>Update Password</Button>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive project updates via email</p>
                    </div>
                    <div className="ml-auto">
                      <input type="checkbox" id="emailNotifications" className="form-checkbox h-5 w-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Task Assignments</h4>
                      <p className="text-sm text-muted-foreground">Notify when assigned to tasks</p>
                    </div>
                    <div className="ml-auto">
                      <input type="checkbox" id="taskAssignments" className="form-checkbox h-5 w-5 text-primary" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Project Updates</h4>
                      <p className="text-sm text-muted-foreground">Notify about project milestone completion</p>
                    </div>
                    <div className="ml-auto">
                      <input type="checkbox" id="projectUpdates" className="form-checkbox h-5 w-5 text-primary" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Button>Save Preferences</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Profile;
