
import { TeamMember } from '@/lib/types/common';

export interface ProjectMemberData {
  id: string;
  user_id?: string;
  name: string;
  role: string;
}

export interface ProjectManagerData {
  id: string;
  name: string;
}
