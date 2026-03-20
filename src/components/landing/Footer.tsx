import { Smartphone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-8">
      <div className="mx-auto max-w-lg text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10">
            <Smartphone className="h-4 w-4 text-brand-orange" />
          </div>
          <span className="text-sm font-bold text-foreground">iPhone Upgrade</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Compra, venda e troca de iPhones. Cotação rápida e estimada.
          <br />Os valores podem variar após análise presencial do aparelho.
        </p>
        <p className="mt-4 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} iPhone Upgrade. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
