import { AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  text?: string;
}

export function Disclaimer({ text }: DisclaimerProps) {
  const disclaimerText = text || 'Esta cotação é uma estimativa e pode variar após análise presencial/técnica do aparelho. Os valores finais serão confirmados por nossa equipe.';

  return (
    <div className="flex gap-3 rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-4">
      <AlertTriangle className="h-5 w-5 shrink-0 text-brand-orange mt-0.5" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        Esta cotação é uma <strong className="text-foreground">estimativa</strong>. {disclaimerText}
      </p>
    </div>
  );
}
