import { CONDITIONS } from '@/data/catalog';
import { SelectionCard } from '@/components/simulator/SelectionCard';
import { SimulatorData } from '@/types/simulator';

interface Props { data: SimulatorData; onUpdate: (u: Partial<SimulatorData>) => void; }

export function StepCondition({ data, onUpdate }: Props) {
  return (
    <div className="space-y-4 step-enter">
      <div>
        <h2 className="text-xl font-bold text-foreground">Estado geral do aparelho</h2>
        <p className="mt-1 text-sm text-muted-foreground">Como está a aparência e funcionamento?</p>
      </div>
      <div className="space-y-2.5">
        {CONDITIONS.map(c => (
          <SelectionCard key={c.id} selected={data.condition === c.id} onClick={() => onUpdate({ condition: c.id })}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{c.emoji}</span>
              <div>
                <span className="text-sm font-semibold text-foreground">{c.label}</span>
                <p className="text-xs text-muted-foreground">{c.description}</p>
              </div>
            </div>
          </SelectionCard>
        ))}
      </div>
    </div>
  );
}
