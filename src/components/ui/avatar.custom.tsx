
import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'away' | 'offline';
  className?: string;
  showStatus?: boolean;
}

const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getRandomColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
    'bg-fuchsia-500',
    'bg-teal-500',
  ];
  
  // Simple hash function to determine color
  const hash = name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return colors[hash % colors.length];
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'busy':
      return 'bg-red-500';
    case 'away':
      return 'bg-amber-500';
    case 'offline':
      return 'bg-gray-400';
    default:
      return '';
  }
};

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'xs':
      return 'w-6 h-6 text-xs';
    case 'sm':
      return 'w-8 h-8 text-sm';
    case 'md':
      return 'w-10 h-10 text-base';
    case 'lg':
      return 'w-12 h-12 text-lg';
    case 'xl':
      return 'w-16 h-16 text-xl';
    default:
      return 'w-10 h-10 text-base';
  }
};

const getStatusSizeClasses = (size: string) => {
  switch (size) {
    case 'xs':
      return 'w-1.5 h-1.5';
    case 'sm':
      return 'w-2 h-2';
    case 'md':
      return 'w-2.5 h-2.5';
    case 'lg':
      return 'w-3 h-3';
    case 'xl':
      return 'w-4 h-4';
    default:
      return 'w-2.5 h-2.5';
  }
};

export const Avatar = ({
  src,
  name,
  size = 'md',
  status,
  className,
  showStatus = true,
}: AvatarProps) => {
  const sizeClasses = getSizeClasses(size);
  const statusSizeClasses = getStatusSizeClasses(size);
  const statusColor = getStatusColor(status);
  const bgColor = getRandomColor(name);

  return (
    <div className={cn('relative inline-flex', className)}>
      {src ? (
        <div
          className={cn(
            sizeClasses,
            'rounded-full overflow-hidden ring-2 ring-white/10 shadow-md flex items-center justify-center'
          )}
        >
          <img src={src} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          className={cn(
            sizeClasses,
            bgColor,
            'rounded-full overflow-hidden ring-2 ring-white/10 shadow-md flex items-center justify-center text-white font-medium'
          )}
        >
          {getInitials(name)}
        </div>
      )}
      
      {showStatus && status && (
        <span
          className={cn(
            statusSizeClasses,
            statusColor,
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-gray-900'
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
