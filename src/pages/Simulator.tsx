import { useSimulator } from '@/hooks/useSimulator';
import { useCatalog, usePricingRules, useAppSettings } from '@/hooks/useFirebaseData';
import { StepProgress } from '@/components/simulator/StepProgress';
import { GlowButton } from '@/components/simulator/GlowButton';
import { StepModel } from '@/components/steps/StepModel';
import { StepStorage } from '@/components/steps/StepStorage';
import { StepColor } from '@/components/steps/StepColor';
import { StepBattery } from '@/components/steps/StepBattery';
import { StepCondition } from '@/components/steps/StepCondition';
import { StepDefects } from '@/components/steps/StepDefects';
import { StepPhotos } from '@/components/steps/StepPhotos';
import { StepDesired } from '@/components/steps/StepDesired';
import { StepPayment } from '@/components/steps/StepPayment';
import { StepContact } from '@/components/steps/StepContact';
import { DEFECT_QUESTIONS } from '@/data/catalog';
import { DefectsData, TOTAL_STEPS } from '@/types/simulator';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Simulator() {
  const navigate = useNavigate();
  const { activeTradeInModels, activeSaleModels, loading: catalogLoading } = useCatalog();
  const { rules } = usePricingRules();
  const { settings } = useAppSettings();

  const sim = useSimulator({
    tradeInModels: activeTradeInModels,
    saleModels: activeSaleModels,
    pricingRules: rules,
    settings,
  });
  const { currentStep, data, updateData, updateDefect, nextStep, prevStep, markCompleted, totalSteps } = sim;

  // Filter defect questions based on settings
  const activeDefectQuestions = DEFECT_QUESTIONS.filter(q => settings.questionsConfig[q.key] !== false);

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return !!data.currentModel;
      case 1: return !!data.currentStorage;
      case 2: return !!data.currentColor;
      case 3: return true;
      case 4: return !!data.condition;
      case 5: return activeDefectQuestions.every(q => data.defects[q.key as keyof DefectsData] !== null);
      case 6: return true;
      case 7: return !!data.desiredModel && !!data.desiredStorage && !!data.desiredCondition;
      case 8: return !!data.paymentMethod;
      case 9: return data.name.trim().length >= 2 && data.phone.replace(/\D/g, '').length >= 10;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      markCompleted();
      navigate('/resultado');
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/');
    } else {
      prevStep();
    }
  };

  if (catalogLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepModel data={data} onUpdate={updateData} models={activeTradeInModels} />;
      case 1: return <StepStorage data={data} onUpdate={updateData} models={activeTradeInModels} />;
      case 2: return <StepColor data={data} onUpdate={updateData} models={activeTradeInModels} />;
      case 3: return <StepBattery data={data} onUpdate={updateData} />;
      case 4: return <StepCondition data={data} onUpdate={updateData} />;
      case 5: return <StepDefects data={data} updateDefect={updateDefect} questions={activeDefectQuestions} />;
      case 6: return <StepPhotos data={data} onUpdate={updateData} settings={settings} />;
      case 7: return <StepDesired data={data} onUpdate={updateData} models={activeSaleModels} />;
      case 8: return <StepPayment data={data} onUpdate={updateData} />;
      case 9: return <StepContact data={data} onUpdate={updateData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto max-w-lg flex items-center gap-3">
          <button onClick={handleBack} className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border active:scale-95 transition-transform">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-lg" key={currentStep}>
          {renderStep()}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-background/90 backdrop-blur-xl px-4 py-4">
        <div className="mx-auto max-w-lg">
          <GlowButton
            size="lg"
            className="w-full"
            disabled={!canProceed()}
            glow={canProceed()}
            onClick={handleNext}
          >
            {currentStep === totalSteps - 1 ? 'Ver minha cotação' : 'Continuar'}
            <ArrowRight className="h-5 w-5" />
          </GlowButton>
        </div>
      </footer>
    </div>
  );
}
