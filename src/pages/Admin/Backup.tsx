
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HardDrive, Clock, Calendar, Download, UploadCloud, RotateCcw, History, Database, CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

const BackupItem = ({ 
  name, 
  date, 
  size, 
  type,
  status = 'completed'
}: { 
  name: string; 
  date: string; 
  size: string;
  type: 'full' | 'incremental' | 'differential';
  status?: 'completed' | 'in-progress' | 'failed';
}) => {
  const statusColors = {
    'completed': 'bg-success/10 text-success',
    'in-progress': 'bg-primary/10 text-primary',
    'failed': 'bg-destructive/10 text-destructive'
  };
  
  const typeIcons = {
    'full': <Database className="h-4 w-4" />,
    'incremental': <History className="h-4 w-4" />,
    'differential': <RotateCcw className="h-4 w-4" />
  };

  return (
    <div className="p-4 border border-border/40 rounded-md bg-card flex items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
        <HardDrive className="h-5 w-5 text-foreground/70" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{name}</h4>
          <Badge variant="outline" className="flex items-center gap-1">
            {typeIcons[type]}
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </Badge>
          <Badge className={statusColors[status]}>
            {status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div className="flex text-sm text-muted-foreground mt-1">
          <div className="flex items-center gap-1 mr-4">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="h-3.5 w-3.5" />
            <span>{size}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <RotateCcw className="h-4 w-4" />
          <span>Restore</span>
        </Button>
      </div>
    </div>
  );
};

const AdminBackup = () => {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  
  const handleStartBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  return (
    <AdminLayout title="Backup & Recovery" currentTab="backup">
      <div className="space-y-6">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Backup & Recovery Management</CardTitle>
            <CardDescription>Manage system backups and recovery options</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="backups">
              <TabsList className="mb-6">
                <TabsTrigger value="backups" className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  <span>Backups</span>
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Schedule</span>
                </TabsTrigger>
                <TabsTrigger value="recovery" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  <span>Recovery</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="backups" className="space-y-6">
                <Card className="border border-border/40 bg-muted/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Create New Backup</h3>
                        <p className="text-sm text-muted-foreground">Create a new system backup with selected options</p>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          disabled={isBackingUp}
                          className="flex items-center gap-1"
                        >
                          <Database className="h-4 w-4" />
                          <span>Configure</span>
                        </Button>
                        <Button 
                          onClick={handleStartBackup} 
                          disabled={isBackingUp}
                          className="flex items-center gap-1"
                        >
                          <UploadCloud className="h-4 w-4" />
                          <span>{isBackingUp ? 'Backing up...' : 'Start Backup'}</span>
                        </Button>
                      </div>
                    </div>
                    
                    {isBackingUp && (
                      <div className="mb-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Backup in progress</span>
                          <span>{backupProgress}%</span>
                        </div>
                        <Progress value={backupProgress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Recent Backups</h3>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Show All</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <BackupItem 
                      name="Weekly Full Backup" 
                      date="Today at 3:00 AM" 
                      size="4.2 GB" 
                      type="full"
                    />
                    <BackupItem 
                      name="Daily Incremental Backup" 
                      date="Yesterday at 3:00 AM" 
                      size="645 MB" 
                      type="incremental"
                    />
                    <BackupItem 
                      name="Daily Incremental Backup" 
                      date="May 15, 2025 at 3:00 AM" 
                      size="722 MB" 
                      type="incremental"
                    />
                    <BackupItem 
                      name="Database Backup" 
                      date="May 14, 2025 at 2:30 PM" 
                      size="1.8 GB" 
                      type="differential"
                      status="failed"
                    />
                    <BackupItem 
                      name="Weekly Full Backup" 
                      date="May 14, 2025 at 3:00 AM" 
                      size="4.1 GB" 
                      type="full"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <Card className="border border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Backup Schedule</CardTitle>
                    <CardDescription>Configure automated backup schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                      <div className="text-center">
                        <Clock className="h-12 w-12 text-primary mx-auto mb-2 opacity-60" />
                        <p className="text-muted-foreground">Backup scheduling configuration would appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recovery" className="space-y-4">
                <Card className="border border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">System Recovery</CardTitle>
                    <CardDescription>Restore system from previous backups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                      <div className="text-center">
                        <RotateCcw className="h-12 w-12 text-primary mx-auto mb-2 opacity-60" />
                        <p className="text-muted-foreground">System recovery interface would appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBackup;
