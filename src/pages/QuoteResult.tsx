import { useSimulator } from '@/hooks/useSimulator';
import { TRADE_IN_MODELS, SALE_MODELS, formatCurrency, formatStorage } from '@/data/catalog';
import { Disclaimer } from '@/components/simulator/Disclaimer';
import { GlowButton } from '@/components/simulator/GlowButton';
import { MessageCircle, RotateCcw, ArrowDown, ArrowUp, TrendingDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuoteResult() {
  const navigate = useNavigate();
  const { data, quote, resetSimulator } = useSimulator();

  const tradeModel = TRADE_IN_MODELS.find(m => m.id === data.currentModel);
  const saleModel = SALE_MODELS.find(m => m.id === data.desiredModel);

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

  const whatsappMsg = encodeURIComponent(
    `Olá! Fiz uma simulação de upgrade:\n\n` +
    `📱 Meu aparelho: ${tradeModel.name} ${formatStorage(data.currentStorage!)} — ${formatCurrency(quote.finalTradeInValue)}\n` +
    `✨ Desejo: ${saleModel.name} ${formatStorage(data.desiredStorage!)} (${data.desiredCondition === 'sealed' ? 'Lacrado' : 'Usado'}) — ${formatCurrency(quote.desiredPhonePrice)}\n` +
    `💰 Diferença estimada: ${formatCurrency(quote.difference)}\n\n` +
    `Nome: ${data.name}\nTelefone: ${data.phone}`
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-brand-orange" />
            <span className="text-xs font-semibold text-brand-orange">Cotação estimada</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sua simulação está pronta!</h1>
          <p className="mt-2 text-sm text-muted-foreground">{data.name}, confira os valores estimados abaixo</p>
        </div>

        {/* Trade-in value card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-green-400" />
              <span className="text-sm font-semibold text-foreground">Seu aparelho</span>
            </div>
            <span className="text-xs text-muted-foreground">{tradeModel.name} {formatStorage(data.currentStorage!)}</span>
          </div>
          <p className="text-3xl font-bold text-green-400 tabular-nums">{formatCurrency(quote.finalTradeInValue)}</p>
          {/* Deductions detail */}
          <div className="space-y-1.5 border-t border-border pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Valor base</span>
              <span className="text-foreground tabular-nums">{formatCurrency(quote.currentPhoneBaseValue)}</span>
            </div>
            {quote.batteryDeduction > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Bateria ({data.batteryHealth}%)</span>
                <span className="text-red-400 tabular-nums">-{formatCurrency(quote.batteryDeduction)}</span>
              </div>
            )}
            {quote.conditionDeduction > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Estado geral</span>
                <span className="text-red-400 tabular-nums">-{formatCurrency(quote.conditionDeduction)}</span>
              </div>
            )}
            {quote.defectsDeduction > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Defeitos</span>
                <span className="text-red-400 tabular-nums">-{formatCurrency(quote.defectsDeduction)}</span>
              </div>
            )}
            {quote.boxBonus > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Bônus caixa</span>
                <span className="text-green-400 tabular-nums">+{formatCurrency(quote.boxBonus)}</span>
              </div>
            )}
            {quote.invoiceBonus > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Bônus nota fiscal</span>
                <span className="text-green-400 tabular-nums">+{formatCurrency(quote.invoiceBonus)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Desired phone card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-brand-blue-glow" />
              <span className="text-sm font-semibold text-foreground">Aparelho desejado</span>
            </div>
            <span className="text-xs text-muted-foreground">{data.desiredCondition === 'sealed' ? 'Lacrado' : 'Usado'}</span>
          </div>
          <p className="text-xs text-muted-foreground">{saleModel.name} {formatStorage(data.desiredStorage!)}</p>
          <p className="text-2xl font-bold text-brand-blue-glow tabular-nums">{formatCurrency(quote.desiredPhonePrice)}</p>
        </div>

        {/* Difference */}
        <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-6 text-center glow-orange-sm animate-fade-in-up stagger-3">
          <p className="text-sm font-medium text-muted-foreground mb-1">Diferença estimada a pagar</p>
          <p className="text-4xl font-bold text-brand-orange tabular-nums">{formatCurrency(quote.difference)}</p>
        </div>

        <Disclaimer />

        {/* CTAs */}
        <div className="space-y-3 animate-fade-in-up stagger-4">
          <GlowButton
            size="lg"
            glow
            className="w-full"
            onClick={() => window.open(`https://wa.me/5511999999999?text=${whatsappMsg}`, '_blank')}
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
