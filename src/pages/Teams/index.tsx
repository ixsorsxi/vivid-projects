
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Teams = () => {
  return (
    <PageContainer title="Teams">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Teams</h1>
            <p className="text-muted-foreground">Manage your team members and team settings.</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Team
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* This will be populated with real data in future updates */}
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-2">Design Team</h3>
            <p className="text-muted-foreground mb-3">5 members</p>
            <div className="flex justify-end">
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-2">Development Team</h3>
            <p className="text-muted-foreground mb-3">8 members</p>
            <div className="flex justify-end">
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-2">Marketing Team</h3>
            <p className="text-muted-foreground mb-3">3 members</p>
            <div className="flex justify-end">
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Team Invitations</h2>
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <p className="text-muted-foreground">No pending invitations</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Teams;
