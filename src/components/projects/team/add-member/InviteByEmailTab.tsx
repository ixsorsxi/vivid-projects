
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InviteByEmailTabProps {
  inviteEmail: string;
  inviteRole: string;
  onEmailChange: (email: string) => void;
  onRoleChange: (role: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const InviteByEmailTab: React.FC<InviteByEmailTabProps> = ({
  inviteEmail,
  inviteRole,
  onEmailChange,
  onRoleChange,
  onCancel,
  onSubmit
}) => {
  return (
    <>
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={inviteEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter email address"
          prefix={<Mail className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      <div>
        <Label htmlFor="invite-role">Role</Label>
        <Select value={inviteRole} onValueChange={onRoleChange}>
          <SelectTrigger id="invite-role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Project Manager">Project Manager</SelectItem>
            <SelectItem value="Developer">Developer</SelectItem>
            <SelectItem value="Designer">Designer</SelectItem>
            <SelectItem value="QA Engineer">QA Engineer</SelectItem>
            <SelectItem value="Product Owner">Product Owner</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          Send Invitation
        </Button>
      </DialogFooter>
    </>
  );
};

export default InviteByEmailTab;
