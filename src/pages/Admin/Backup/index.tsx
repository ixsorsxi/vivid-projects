
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardDrive, Clock, RotateCcw } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import BackupsTab from './components/BackupsTab';
import ScheduleTab from './components/ScheduleTab';
import RecoveryTab from './components/RecoveryTab';

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
              
              <TabsContent value="backups">
                <BackupsTab
                  isBackingUp={isBackingUp}
                  backupProgress={backupProgress}
                  handleStartBackup={handleStartBackup}
                />
              </TabsContent>
              
              <TabsContent value="schedule">
                <ScheduleTab />
              </TabsContent>
              
              <TabsContent value="recovery">
                <RecoveryTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBackup;
