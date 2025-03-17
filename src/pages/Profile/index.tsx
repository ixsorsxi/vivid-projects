
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Shield, 
  Settings as SettingsIcon, 
  Award,
  Activity,
  Clock
} from 'lucide-react';
import { updateUserSettings } from '@/context/auth/profileService';
import Avatar from '@/components/ui/avatar.custom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toast-wrapper';

const Profile = () => {
  const { user, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTheme, setActiveTheme] = useState('system');

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleThemeChange = async (value: string) => {
    setActiveTheme(value);
    
    if (user) {
      try {
        // Update user settings in database
        await updateUserSettings(user.id, { theme: value });
        toast.success('Theme preferences updated');
      } catch (error) {
        console.error('Failed to update theme preference:', error);
        toast.error('Failed to update preferences');
      }
    }
  };

  return (
    <PageContainer title="Profile">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="md:w-1/3 w-full">
            <Card className="w-full bg-card">
              <CardHeader className="flex flex-col items-center text-center pb-4">
                <div className="w-24 h-24 mb-4">
                  <Avatar 
                    src={user?.avatar || ''}
                    name={user?.name || 'User'} 
                    className="w-24 h-24 text-3xl border-4 border-primary/20" 
                  />
                </div>
                <CardTitle className="text-2xl">{user?.name || 'User'}</CardTitle>
                <CardDescription className="flex items-center gap-1 justify-center">
                  <Mail className="h-4 w-4" />
                  {user?.email || 'user@example.com'}
                </CardDescription>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.role || 'User'}
                </div>
              </CardHeader>
              <CardFooter className="flex justify-center pb-6">
                <Button variant="outline" onClick={handleLogout} className="w-full">Sign Out</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:w-2/3 w-full">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="account">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Preferences
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Manage your account details and personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                        <div className="p-2 border rounded-md bg-background">{user?.name || 'User'}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Email Address</div>
                        <div className="p-2 border rounded-md bg-background">{user?.email || 'user@example.com'}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Role</div>
                        <div className="p-2 border rounded-md bg-background">{user?.role || 'User'}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Member Since</div>
                        <div className="p-2 border rounded-md bg-background">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/settings')}>
                      Edit Profile
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      View your recent actions and activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user ? (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="space-y-0 divide-y">
                            <ActivityItem 
                              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                              title="Logged in" 
                              description="You logged into your account" 
                              time="Just now" 
                            />
                            <ActivityItem 
                              icon={<Award className="h-4 w-4 text-muted-foreground" />}
                              title="Completed task" 
                              description="You completed a task in the project" 
                              time="2 hours ago" 
                            />
                            <ActivityItem 
                              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                              title="Created project" 
                              description="You created a new project" 
                              time="Yesterday" 
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-6 text-muted-foreground">
                          Please log in to view your activity
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Manage your application preferences and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Theme</div>
                      <Select value={activeTheme} onValueChange={handleThemeChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Choose your preferred theme appearance
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Email Notifications</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="email-tasks"
                            defaultChecked
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="email-tasks" className="text-sm">Task updates</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="email-projects"
                            defaultChecked
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="email-projects" className="text-sm">Project changes</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="email-messages"
                            defaultChecked
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="email-messages" className="text-sm">New messages</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="email-announcements"
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="email-announcements" className="text-sm">Announcements</label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

// Helper component for activity items
const ActivityItem = ({ 
  icon, 
  title, 
  description, 
  time 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  time: string 
}) => {
  return (
    <div className="flex items-start p-4 hover:bg-muted/50">
      <div className="mr-4 mt-0.5 rounded-full p-2 bg-muted">{icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  );
};

export default Profile;
