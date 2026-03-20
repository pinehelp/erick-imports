import { Shield, Clock, TrendingUp, BadgeCheck } from 'lucide-react';

const benefits = [
  { icon: Clock, title: 'Cotação em minutos', desc: 'Sem espera, resultado instantâneo' },
  { icon: TrendingUp, title: 'Melhor valor', desc: 'Avaliação justa e competitiva' },
  { icon: Shield, title: 'Segurança total', desc: 'Processo transparente e confiável' },
  { icon: BadgeCheck, title: 'Especialistas Apple', desc: 'Trabalhamos exclusivamente com iPhone' },
];

export function Benefits() {
  return (
    <section className="px-4 py-16 surface-alt">
      <div className="mx-auto max-w-lg">
        <h2 className="text-center text-2xl font-bold text-foreground mb-10" style={{ textWrap: 'balance' }}>
          Por que trocar conosco?
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue-glow">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{b.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
