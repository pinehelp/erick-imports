import { SelectionCard } from '@/components/simulator/SelectionCard';
import { SimulatorData, TradeInModel } from '@/types/simulator';

interface Props {
  data: SimulatorData;
  onUpdate: (u: Partial<SimulatorData>) => void;
  models: TradeInModel[];
}

export function StepModel({ data, onUpdate, models }: Props) {
  return (
    <div className="space-y-4 step-enter">
      <div>
        <h2 className="text-xl font-bold text-foreground">Qual é o seu iPhone atual?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Selecione o modelo que você deseja trocar</p>
      </div>
      <div className="grid grid-cols-1 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
        {models.map(model => (
          <SelectionCard
            key={model.id}
            selected={data.currentModel === model.id}
            onClick={() => onUpdate({ currentModel: model.id, currentStorage: null, currentColor: null })}
          >
            <span className="text-sm font-semibold text-foreground">{model.name}</span>
          </SelectionCard>
        ))}
      </div>
    </div>
  );
}
