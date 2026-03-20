import { cn } from '@/lib/utils';
import { LEAD_STATUS_OPTIONS, LeadStatus } from '@/types/admin';

export function StatusBadge({ status, size = 'sm' }: { status: LeadStatus; size?: 'sm' | 'md' }) {
  const opt = LEAD_STATUS_OPTIONS.find(o => o.value === status);
  if (!opt) return null;
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
    )}>
      <span className={cn('h-1.5 w-1.5 rounded-full', opt.color)} />
      {opt.label}
    </span>
  );
}
