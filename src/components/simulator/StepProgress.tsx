import { cn } from '@/lib/utils';
import { STEP_LABELS } from '@/types/simulator';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full space-y-3">
      {/* Progress bar */}
      <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-orange-strong to-brand-orange transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Step info */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Etapa {currentStep + 1} de {totalSteps}
        </span>
        <span className="text-xs font-medium text-brand-orange">
          {STEP_LABELS[currentStep]}
        </span>
      </div>
    </div>
  );
}
