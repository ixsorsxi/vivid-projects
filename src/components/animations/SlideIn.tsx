
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Direction = 'left' | 'right' | 'up' | 'down';

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export const SlideIn = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 400,
  distance = 50,
  once = true,
  threshold = 0.1,
}: SlideInProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const getTransform = (dir: Direction, dist: number, visible: boolean) => {
    if (visible) return 'translate3d(0, 0, 0)';
    
    switch (dir) {
      case 'left':
        return `translate3d(-${dist}px, 0, 0)`;
      case 'right':
        return `translate3d(${dist}px, 0, 0)`;
      case 'up':
        return `translate3d(0, -${dist}px, 0)`;
      case 'down':
        return `translate3d(0, ${dist}px, 0)`;
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(direction, distance, isVisible),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default SlideIn;
