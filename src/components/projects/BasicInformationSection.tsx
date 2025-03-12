
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hash, Calendar, DollarSign } from "lucide-react";

interface BasicInformationSectionProps {
  projectName: string;
  setProjectName: (value: string) => void;
  projectDescription: string;
  setProjectDescription: (value: string) => void;
  projectCategory: string;
  setProjectCategory: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  projectCode: string;
  budget: string;
  setBudget: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  projectCategory,
  setProjectCategory,
  dueDate,
  setDueDate,
  projectCode,
  budget,
  setBudget,
  currency,
  setCurrency
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name *</Label>
          <Input
            id="projectName"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="projectCode">Project Code</Label>
          <Input
            id="projectCode"
            value={projectCode}
            prefix={<Hash className="h-4 w-4 text-muted-foreground" />}
            readOnly
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="projectDescription">Description</Label>
        <textarea
          id="projectDescription"
          placeholder="Enter project description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectCategory">Category</Label>
          <Select value={projectCategory} onValueChange={setProjectCategory}>
            <SelectTrigger id="projectCategory">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            prefix={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectBudget">Budget</Label>
          <div className="flex gap-2">
            <Input
              id="projectBudget"
              type="number"
              placeholder="Enter budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              prefix={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;
