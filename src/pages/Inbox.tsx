
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Card } from '@/components/ui/card';
import { 
  Archive, 
  ArrowDown, 
  Check, 
  ChevronDown, 
  Filter, 
  Flag, 
  Inbox as InboxIcon, 
  MoreHorizontal, 
  RefreshCw, 
  Search, 
  Star, 
  Trash2, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const Inbox = () => {
  const notifications = [
    { 
      id: '1', 
      title: 'Website Redesign Updates', 
      preview: 'The team has completed the initial mockups for the homepage redesign...',
      sender: 'John Doe',
      time: '10:30 AM',
      read: false,
      flagged: true,
      category: 'project'
    },
    { 
      id: '2', 
      title: 'New Task Assignment', 
      preview: 'You have been assigned a new task: "Implement authentication system"...',
      sender: 'Emily Davis',
      time: 'Yesterday',
      read: false,
      flagged: false,
      category: 'task'
    },
    { 
      id: '3', 
      title: 'Meeting Minutes: Client Review', 
      preview: 'Attached are the minutes from yesterday's client review meeting...',
      sender: 'Jane Smith',
      time: 'Yesterday',
      read: true,
      flagged: false,
      category: 'meeting'
    },
    { 
      id: '4', 
      title: 'Budget approval for Marketing Campaign', 
      preview: 'The requested budget for the Q3 marketing campaign has been approved...',
      sender: 'Robert Johnson',
      time: '2 days ago',
      read: true,
      flagged: true,
      category: 'project'
    },
    { 
      id: '5', 
      title: 'Weekly Team Progress Report', 
      preview: 'Here's a summary of all team activities and progress from the past week...',
      sender: 'Michael Brown',
      time: '3 days ago',
      read: true,
      flagged: false,
      category: 'report'
    },
    { 
      id: '6', 
      title: 'System Update Notification', 
      preview: 'The project management system will be undergoing maintenance this weekend...',
      sender: 'System Administrator',
      time: '1 week ago',
      read: true,
      flagged: false,
      category: 'system'
    },
  ];
  
  // Filter for unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <PageContainer 
      title="Inbox" 
      subtitle="Manage your notifications and updates"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="p-4">
            <Button className="w-full justify-start gap-2 mb-6">
              <InboxIcon className="h-4 w-4" />
              <span>Compose</span>
            </Button>
            
            <nav>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 rounded-md bg-primary/10 text-primary">
                    <div className="flex items-center gap-2">
                      <InboxIcon className="h-4 w-4" />
                      <span>Inbox</span>
                    </div>
                    <Badge size="sm">{unreadCount}</Badge>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>Starred</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      <span>Flagged</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70">
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      <span>Archived</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      <span>Trash</span>
                    </div>
                  </a>
                </li>
              </ul>
            </nav>
            
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium px-3 mb-2">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span>Project</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span>Task</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      <span>Meeting</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      <span>Report</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className="border overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="select-all" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <span>All</span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All</DropdownMenuItem>
                      <DropdownMenuItem>None</DropdownMenuItem>
                      <DropdownMenuItem>Read</DropdownMenuItem>
                      <DropdownMenuItem>Unread</DropdownMenuItem>
                      <DropdownMenuItem>Flagged</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="relative h-8 w-px bg-border mx-1"></div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    className="pl-9" 
                    placeholder="Search inbox..." 
                  />
                </div>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="p-4">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="flagged">Flagged</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "flex items-start gap-4 py-3 px-2 hover:bg-muted/50",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox id={`select-${notification.id}`} />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-amber-500"
                        >
                          {notification.flagged ? <Star className="h-4 w-4 fill-amber-500" /> : <Star className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar name={notification.sender} size="sm" />
                            <span className={cn("font-medium", !notification.read && "font-semibold")}>{notification.sender}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                        
                        <h4 className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</h4>
                        <p className="text-sm text-muted-foreground truncate mt-1">{notification.preview}</p>
                        
                        <div className="mt-2">
                          <Badge 
                            size="sm" 
                            variant="outline" 
                            className={cn(
                              notification.category === 'project' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                              notification.category === 'task' && "bg-green-500/10 text-green-500 border-green-500/20",
                              notification.category === 'meeting' && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                              notification.category === 'report' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                              notification.category === 'system' && "bg-gray-500/10 text-gray-500 border-gray-500/20"
                            )}
                          >
                            {notification.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="unread" className="mt-0">
                <div className="divide-y">
                  {notifications.filter(n => !n.read).map((notification) => (
                    <div 
                      key={notification.id} 
                      className="flex items-start gap-4 py-3 px-2 hover:bg-muted/50 bg-primary/5"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox id={`select-unread-${notification.id}`} />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-amber-500"
                        >
                          {notification.flagged ? <Star className="h-4 w-4 fill-amber-500" /> : <Star className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar name={notification.sender} size="sm" />
                            <span className="font-semibold">{notification.sender}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                        </div>
                        
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground truncate mt-1">{notification.preview}</p>
                        
                        <div className="mt-2">
                          <Badge 
                            size="sm" 
                            variant="outline" 
                            className={cn(
                              notification.category === 'project' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                              notification.category === 'task' && "bg-green-500/10 text-green-500 border-green-500/20",
                              notification.category === 'meeting' && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                              notification.category === 'report' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                              notification.category === 'system' && "bg-gray-500/10 text-gray-500 border-gray-500/20"
                            )}
                          >
                            {notification.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="flagged" className="mt-0">
                <div className="divide-y">
                  {notifications.filter(n => n.flagged).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "flex items-start gap-4 py-3 px-2 hover:bg-muted/50",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox id={`select-flagged-${notification.id}`} />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-amber-500"
                        >
                          <Star className="h-4 w-4 fill-amber-500" />
                        </Button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar name={notification.sender} size="sm" />
                            <span className={cn("font-medium", !notification.read && "font-semibold")}>{notification.sender}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                        
                        <h4 className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</h4>
                        <p className="text-sm text-muted-foreground truncate mt-1">{notification.preview}</p>
                        
                        <div className="mt-2">
                          <Badge 
                            size="sm" 
                            variant="outline" 
                            className={cn(
                              notification.category === 'project' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                              notification.category === 'task' && "bg-green-500/10 text-green-500 border-green-500/20",
                              notification.category === 'meeting' && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                              notification.category === 'report' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                              notification.category === 'system' && "bg-gray-500/10 text-gray-500 border-gray-500/20"
                            )}
                          >
                            {notification.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Inbox;
