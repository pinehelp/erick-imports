import { BatterySlider } from '@/components/simulator/BatterySlider';
import { SimulatorData } from '@/types/simulator';

interface Props { data: SimulatorData; onUpdate: (u: Partial<SimulatorData>) => void; }

export function StepBattery({ data, onUpdate }: Props) {
  return (
    <div className="space-y-6 step-enter">
      <div>
        <h2 className="text-xl font-bold text-foreground">Saúde da bateria</h2>
        <p className="mt-1 text-sm text-muted-foreground">Informe o percentual de saúde da bateria</p>
      </div>
      <BatterySlider value={data.batteryHealth} onChange={v => onUpdate({ batteryHealth: v })} />
    </div>
  );
}
