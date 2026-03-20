import { cn } from '@/lib/utils';
import { Battery, BatteryWarning } from 'lucide-react';

interface BatterySliderProps {
  value: number;
  onChange: (val: number) => void;
}

export function BatterySlider({ value, onChange }: BatterySliderProps) {
  const getColor = () => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLabel = () => {
    if (value >= 90) return 'Excelente';
    if (value >= 80) return 'Bom';
    if (value >= 70) return 'Razoável';
    if (value >= 60) return 'Fraco';
    return 'Muito fraco';
  };

  return (
    <div className="space-y-6">
      {/* Display */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {value < 60 ? (
            <BatteryWarning className={cn('h-16 w-16', getColor())} />
          ) : (
            <Battery className={cn('h-16 w-16', getColor())} />
          )}
        </div>
        <div className="text-center">
          <span className={cn('text-4xl font-bold tabular-nums', getColor())}>{value}%</span>
          <p className="mt-1 text-sm text-muted-foreground">{getLabel()}</p>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min={50}
          max={100}
          step={1}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-orange
            [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(223,142,53,0.4)]
            [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-[0_0_20px_rgba(223,142,53,0.6)]
            [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-brand-orange [&::-moz-range-thumb]:border-0"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Vá em Ajustes → Bateria → Saúde da Bateria para verificar
      </p>
    </div>
  );
}
