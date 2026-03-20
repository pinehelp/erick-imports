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

        {/* Current phone summary (no value shown) */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Seu aparelho atual</span>
          </div>
          <p className="text-xs text-muted-foreground">{tradeModel.name} · {formatStorage(data.currentStorage!)} · Bateria {data.batteryHealth}%</p>
        </div>
  );
}
