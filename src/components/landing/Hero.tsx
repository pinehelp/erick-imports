import { ArrowRight, MessageCircle, Zap, Shield, Clock, Star } from 'lucide-react';
import { GlowButton } from '@/components/simulator/GlowButton';
import { useNavigate } from 'react-router-dom';
import heroImg from '@/assets/hero-iphones.png';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-12">
      {/* Subtle glow background */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-brand-orange/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-0 w-[300px] h-[300px] rounded-full bg-brand-blue/5 blur-[100px]" />

      <div className="relative mx-auto max-w-lg text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/5 px-4 py-1.5 animate-fade-in">
          <Zap className="h-3.5 w-3.5 text-brand-orange" />
          <span className="text-xs font-medium text-brand-orange">Cotação instantânea</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground animate-fade-in-up" style={{ textWrap: 'balance' }}>
          Troque seu iPhone por um{' '}
          <span className="text-gradient-orange">modelo mais novo</span>
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground animate-fade-in-up stagger-1" style={{ textWrap: 'pretty' }}>
          Descubra em minutos quanto vale o seu aparelho e receba uma estimativa instantânea para o upgrade.
        </p>

        {/* Hero image */}
        <div className="my-8 animate-fade-in-up stagger-2">
          <img
            src={heroImg}
            alt="iPhones com iluminação premium"
            className="mx-auto w-full max-w-sm rounded-2xl"
            loading="eager"
          />
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 animate-fade-in-up stagger-3">
          <GlowButton
            size="lg"
            glow
            onClick={() => navigate('/simulador')}
            className="w-full"
          >
            Simular meu upgrade
            <ArrowRight className="h-5 w-5" />
          </GlowButton>
          <GlowButton
            variant="secondary"
            onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Quero fazer um upgrade de iPhone', '_blank')}
            className="w-full"
          >
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
