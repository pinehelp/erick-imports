import { ToggleYesNo } from '@/components/simulator/ToggleYesNo';
import { SimulatorData, DefectsData } from '@/types/simulator';

interface DefectQuestion {
  key: string;
  label: string;
  invertValue?: boolean;
}

interface Props {
  data: SimulatorData;
  updateDefect: (key: string, val: boolean) => void;
  questions?: DefectQuestion[];
}

export function StepDefects({ data, updateDefect, questions }: Props) {
  // Fallback to all questions from catalog if not passed
  const activeQuestions = questions || [];

  return (
    <div className="space-y-4 step-enter">
      <div>
        <h2 className="text-xl font-bold text-foreground">Condição detalhada</h2>
        <p className="mt-1 text-sm text-muted-foreground">Responda sobre o estado do aparelho</p>
      </div>
      <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
        {activeQuestions.map(q => (
          <ToggleYesNo
            key={q.key}
            label={q.label}
            value={data.defects[q.key as keyof DefectsData]}
            onChange={v => updateDefect(q.key, v)}
          />
        ))}
      </div>
    </div>
  );
}
