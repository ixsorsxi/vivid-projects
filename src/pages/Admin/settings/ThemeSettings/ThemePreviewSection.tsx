
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Users, Settings, FileText } from 'lucide-react';

interface ThemePreviewSectionProps {
  settings: {
    platformTitle: string;
    primaryColor: string;
    backgroundColor: string;
    sidebarColor: string;
    cardColor: string;
    fontFamily: string;
    borderRadius: string;
    slogan: string;
  };
}

const ThemePreviewSection: React.FC<ThemePreviewSectionProps> = ({ settings }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Preview</CardTitle>
        <CardDescription>Real-time preview of your theme changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="rounded-lg overflow-hidden border shadow-sm"
          style={{ 
            background: settings.backgroundColor,
            fontFamily: settings.fontFamily || 'inherit'
          }}
        >
          {/* Mock Header */}
          <div 
            className="p-4 flex items-center justify-between border-b"
            style={{ background: settings.sidebarColor, color: '#fff' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: settings.primaryColor }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">{settings.platformTitle || 'Platform Name'}</div>
                <div className="text-xs opacity-80">{settings.slogan || 'Platform slogan goes here'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                <Bell size={16} />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                <Users size={16} />
              </Button>
            </div>
          </div>
          
          {/* Mock Content */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[200px]">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-2">
              <div 
                className="p-3 rounded flex items-center gap-2"
                style={{ 
                  background: settings.primaryColor,
                  color: '#fff',
                  borderRadius: settings.borderRadius === 'none' ? '0' : undefined 
                }}
              >
                <FileText size={16} />
                <span>Dashboard</span>
              </div>
              <div className="p-3 rounded flex items-center gap-2 hover:bg-black/5">
                <Users size={16} />
                <span>Users</span>
              </div>
              <div className="p-3 rounded flex items-center gap-2 hover:bg-black/5">
                <Settings size={16} />
                <span>Settings</span>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2 space-y-4">
              <Tabs defaultValue="overview">
                <TabsList
                  style={{ 
                    borderRadius: settings.borderRadius === 'none' ? '0' : undefined 
                  }}
                >
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <Card
                    style={{ 
                      background: settings.cardColor,
                      borderRadius: settings.borderRadius === 'none' ? '0' : undefined 
                    }}
                  >
                    <CardHeader>
                      <CardTitle>Project Overview</CardTitle>
                      <CardDescription>Key metrics and details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span>Enable notifications</span>
                        <Switch />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Badge
                          style={{ 
                            background: settings.primaryColor,
                            color: '#fff',
                            borderRadius: settings.borderRadius === 'none' ? '0' : undefined 
                          }}
                        >
                          New
                        </Badge>
                        <Badge variant="outline">Default</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="details">
                  <Card
                    style={{ 
                      background: settings.cardColor,
                      borderRadius: settings.borderRadius === 'none' ? '0' : undefined 
                    }}
                  >
                    <CardHeader>
                      <CardTitle>Project Details</CardTitle>
                      <CardDescription>Advanced information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Detailed project information would be displayed here.</p>
                      <Button 
                        className="mt-4"
                        style={{ 
                          background: settings.primaryColor,
                          color: '#fff',
                          borderRadius: settings.borderRadius === 'none' ? '0' : undefined 
                        }}
                      >
                        Update Project
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemePreviewSection;
