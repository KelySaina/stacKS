import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('panel-surface rounded-[28px] border border-white/60 shadow-panel', className)} {...props} />;
}