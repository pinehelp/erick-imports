import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  accentColor?: 'orange' | 'blue' | 'green' | 'red' | 'default';
}

const accents = {
  orange: 'border-primary/20 bg-primary/5',
  blue: 'border-accent/20 bg-accent/5',
  green: 'border-emerald-500/20 bg-emerald-500/5',
  red: 'border-red-500/20 bg-red-500/5',
  default: 'border-border bg-card',
};

const iconColors = {
  orange: 'text-primary',
  blue: 'text-accent',
  green: 'text-emerald-400',
  red: 'text-red-400',
  default: 'text-muted-foreground',
};

export function MetricCard({ label, value, icon: Icon, trend, trendUp, className, accentColor = 'default' }: MetricCardProps) {
  return (
    <div className={cn('rounded-xl border p-4 space-y-2', accents[accentColor], className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className={cn('h-4 w-4', iconColors[accentColor])} />
      </div>
      <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
      {trend && (
        <p className={cn('text-xs font-medium', trendUp ? 'text-emerald-400' : 'text-red-400')}>
          {trend}
        </p>
      )}
    </div>
  );
}
