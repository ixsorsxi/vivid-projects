
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

const Teams = () => {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Teams</h1>
            <p className="text-muted-foreground">Manage your teams and team members.</p>
          </div>
          <Button className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" /> New Team
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Design Team</CardTitle>
              <CardDescription>5 members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Team focused on UI/UX design for all products.
              </p>
              <Button variant="outline" className="w-full">Manage Team</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Development Team</CardTitle>
              <CardDescription>8 members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Frontend and backend development team.
              </p>
              <Button variant="outline" className="w-full">Manage Team</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Marketing Team</CardTitle>
              <CardDescription>3 members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Team responsible for all marketing activities.
              </p>
              <Button variant="outline" className="w-full">Manage Team</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Team Activity</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Team activity will be integrated with Supabase.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Teams;
