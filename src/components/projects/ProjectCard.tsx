
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ProjectType } from '@/types/project';

interface ProjectCardProps {
  project: ProjectType;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusColors = {
    'not-started': 'bg-slate-100 text-slate-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-amber-100 text-amber-800',
    'completed': 'bg-emerald-100 text-emerald-800'
  };

  const priorityColors = {
    low: 'bg-sky-100 text-sky-800',
    medium: 'bg-violet-100 text-violet-800',
    high: 'bg-rose-100 text-rose-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const dueDate = project.dueDate ? new Date(project.dueDate) : null;
  const dueDistance = dueDate ? formatDistanceToNow(dueDate, { addSuffix: true }) : 'No due date';

  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-4 pb-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary" className={statusColors[project.status as keyof typeof statusColors] || 'bg-slate-100'}>
              {project.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Badge>
            {project.priority && (
              <Badge variant="secondary" className={priorityColors[project.priority as keyof typeof priorityColors] || 'bg-slate-100'}>
                {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
              </Badge>
            )}
          </div>

          <h3 className="text-lg font-medium line-clamp-1">{project.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-2">{project.description}</p>

          <div className="mt-3 space-y-2">
            <div className="text-xs text-muted-foreground">Progress</div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between p-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{dueDistance}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            <span>{project.members?.length || 0}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
