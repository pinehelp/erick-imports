import { Smartphone, Calculator, MessageCircle, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Smartphone, title: 'Informe seu iPhone', desc: 'Selecione modelo, armazenamento e estado do seu aparelho atual' },
  { icon: Calculator, title: 'Receba a cotação', desc: 'Veja instantaneamente o valor estimado e a diferença para o upgrade' },
  { icon: MessageCircle, title: 'Fale conosco', desc: 'Entre em contato pelo WhatsApp para finalizar a troca' },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-lg">
        <h2 className="text-center text-2xl font-bold text-foreground mb-2" style={{ textWrap: 'balance' }}>
          Como funciona
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-10">
          Simples, rápido e sem compromisso
        </p>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-orange tabular-nums">{i + 1}</span>
                  <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
