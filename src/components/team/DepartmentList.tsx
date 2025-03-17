
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Department } from './types';

interface DepartmentListProps {
  departments: Department[];
}

const DepartmentList: React.FC<DepartmentListProps> = ({ departments }) => {
  return (
    <div className="space-y-4">
      {departments.map((dept, index) => (
        <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              {dept.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium">{dept.name}</div>
              <div className="text-xs text-muted-foreground">{dept.members} members</div>
            </div>
          </div>
          <div className="text-sm text-right">
            <div>Team Lead</div>
            <div className="font-medium">{dept.lead}</div>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Department
      </Button>
    </div>
  );
};

export default DepartmentList;
