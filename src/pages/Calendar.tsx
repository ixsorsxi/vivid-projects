
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  PlusCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Calendar = () => {
  // Mock calendar data
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  // Create calendar grid
  const calendarDays = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }
  
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  
  return (
    <PageContainer 
      title="Calendar" 
      subtitle="Schedule and manage project timelines"
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold">
              {currentMonth} {currentYear}
            </h2>
            <Button variant="outline" size="sm">
              Today
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Tabs defaultValue="month">
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="website">Website Redesign</SelectItem>
                <SelectItem value="mobile">Mobile App</SelectItem>
                <SelectItem value="marketing">Marketing Campaign</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>New Event</span>
            </Button>
          </div>
        </div>
        
        <TabsContent value="month" className="mt-0">
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`min-h-24 p-2 border rounded-md ${
                  day === today.getDate() 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'border-border/50 hover:bg-muted/50'
                } ${!day ? 'opacity-50' : ''}`}
              >
                {day && (
                  <>
                    <div className="text-sm font-medium">{day}</div>
                    {/* Example events - would be dynamically generated */}
                    {day === 15 && (
                      <div className="mt-1 p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                        Project Review
                      </div>
                    )}
                    {day === 22 && (
                      <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
                        Client Meeting
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Card>
    </PageContainer>
  );
};

export default Calendar;
