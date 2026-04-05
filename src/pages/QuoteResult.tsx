import { useSimulator } from '@/hooks/useSimulator';
import { useCatalog, usePricingRules, useAppSettings } from '@/hooks/useFirebaseData';
import { Disclaimer } from '@/components/simulator/Disclaimer';
import { GlowButton } from '@/components/simulator/GlowButton';
import { formatCurrency, formatStorage } from '@/data/catalog';
import { MessageCircle, RotateCcw, ArrowDown, ArrowUp, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuoteResult() {
  const navigate = useNavigate();
  const { activeTradeInModels, activeSaleModels, loading: catalogLoading } = useCatalog();
  const { rules } = usePricingRules();
  const { settings } = useAppSettings();

  const { data, quote, resetSimulator } = useSimulator({
    tradeInModels: activeTradeInModels,
    saleModels: activeSaleModels,
    pricingRules: rules,
    settings,
  });

  const tradeModel = activeTradeInModels.find(m => m.id === data.currentModel);
  const saleModel = activeSaleModels.find(m => m.id === data.desiredModel);

  if (catalogLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!quote || !tradeModel || !saleModel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-foreground font-semibold">Cotação não disponível</p>
          <p className="text-sm text-muted-foreground">Complete o simulador para ver sua cotação</p>
          <GlowButton onClick={() => navigate('/simulador')}>Ir para o simulador</GlowButton>
        </div>
      </div>
    );
  }

  const whatsappNumber = settings.whatsappNumber || '5511999999999';
  const whatsappMsg = encodeURIComponent(
    `Olá! Fiz uma simulação de upgrade:\n\n` +
    `📱 Meu aparelho: ${tradeModel.name} ${formatStorage(data.currentStorage!)}\n` +
    `✨ Desejo: ${saleModel.name} ${formatStorage(data.desiredStorage!)} (${data.desiredCondition === 'sealed' ? 'Lacrado' : 'Usado'})\n` +
    `💰 Valor estimado do upgrade: ${formatCurrency(quote.difference)}\n\n` +
    `Nome: ${data.name}\nTelefone: ${data.phone}`
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-brand-orange" />
            <span className="text-xs font-semibold text-brand-orange">Cotação estimada</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sua simulação está pronta!</h1>
          <p className="mt-2 text-sm text-muted-foreground">{data.name}, confira o valor estimado abaixo</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-2 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Seu aparelho atual</span>
          </div>
          <p className="text-xs text-muted-foreground">{tradeModel.name} · {formatStorage(data.currentStorage!)} · Bateria {data.batteryHealth}%</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-2 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-brand-blue-glow" />
              <span className="text-sm font-semibold text-foreground">Aparelho desejado</span>
            </div>
            <span className="text-xs text-muted-foreground">{data.desiredCondition === 'sealed' ? 'Lacrado' : 'Usado'}</span>
          </div>
          <p className="text-xs text-muted-foreground">{saleModel.name} · {formatStorage(data.desiredStorage!)}</p>
        </div>

        <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-6 text-center glow-orange-sm animate-fade-in-up stagger-3">
          <p className="text-sm font-medium text-muted-foreground mb-1">Valor estimado do upgrade</p>
          <p className="text-4xl font-bold text-brand-orange tabular-nums">{formatCurrency(quote.difference)}</p>
        </div>

        <Disclaimer text={settings.disclaimerText} />

        <div className="space-y-3 animate-fade-in-up stagger-4">
          <GlowButton
            size="lg"
            glow
            className="w-full"
            onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`, '_blank')}
          >
            <MessageCircle className="h-5 w-5" />
            Falar no WhatsApp
          </GlowButton>
          <GlowButton
            variant="secondary"
            className="w-full"
            onClick={() => { resetSimulator(); navigate('/simulador'); }}
          >
            <RotateCcw className="h-4 w-4" />
            Simular novamente
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
