
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { useAuth } from '@/context/auth';
import { Avatar } from '@/components/ui/avatar.custom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge.custom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Mail, MapPin, Briefcase, Clock, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('overview');

  // Default values for user fields that might be undefined
  const userBio = user?.bio || "No bio information available. Update your profile to add a bio.";
  const userLocation = user?.location || "No location available";
  const userDepartment = user?.department || "No department information";
  const userJoinDate = user?.joinDate || "Unknown";
  const userSkills = user?.skills || ["Project Management", "Team Leadership", "Communication"];

  return (
    <PageContainer title="" subtitle="">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-8">
          {/* Profile Header with Background */}
          <div className="h-40 md:h-52 bg-primary/5 rounded-lg overflow-hidden">
            <div className="absolute inset-0 opacity-20"></div>
          </div>
          
          {/* Profile Info Card - Positioned over the background */}
          <Card className="max-w-4xl mx-auto -mt-16 relative z-10 shadow-sm">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-0">
              <div className="-mt-12 md:-mt-16 rounded-xl p-1.5 bg-background shadow-md ring-1 ring-border/50">
                <Avatar
                  name={user?.name || 'User'}
                  src={user?.avatar || undefined}
                  size="xl"
                  className="h-20 w-20 md:h-24 md:w-24"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-semibold">
                      {user?.name || 'Welcome!'}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1.5 gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {user?.email || 'user@example.com'}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user?.role && (
                      <Badge variant="outline" className="py-1 bg-primary/5 text-xs font-medium">
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <div className="px-6 py-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-muted/50 p-1">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="projects" className="flex-1">Projects</TabsTrigger>
                  <TabsTrigger value="tasks" className="flex-1">Tasks</TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="py-4 animate-in fade-in-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-semibold">About</h3>
                        <p className="text-muted-foreground mt-2 text-sm">
                          {userBio}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-semibold">Contact Information</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{user?.email || "No email available"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{userLocation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-semibold">Work Information</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{userDepartment}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Member since {userJoinDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-semibold">Skills</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {userSkills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-secondary/30">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="projects" className="py-4">
                  <div className="text-center py-8">
                    <h3 className="text-base font-medium">Projects tab content will go here</h3>
                    <p className="text-muted-foreground mt-2 text-sm">This section would display user's projects</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="tasks" className="py-4">
                  <div className="text-center py-8">
                    <h3 className="text-base font-medium">Tasks tab content will go here</h3>
                    <p className="text-muted-foreground mt-2 text-sm">This section would display user's tasks</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="py-4">
                  <div className="text-center py-8">
                    <h3 className="text-base font-medium">Settings tab content will go here</h3>
                    <p className="text-muted-foreground mt-2 text-sm">This section would allow user to edit profile settings</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button variant="outline" size="sm" className="mr-2">Edit Profile</Button>
              <Button size="sm">Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
