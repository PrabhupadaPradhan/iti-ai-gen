
import React from 'react';
import { Card as ShadcnCard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className,
  headerClassName,
  contentClassName,
}) => {
  return (
    <ShadcnCard className={cn('w-full', className)}>
      {title && (
        <CardHeader className={cn(headerClassName)}>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(contentClassName)}>
        {children}
      </CardContent>
    </ShadcnCard>
  );
};
