import { useState, useEffect, useCallback, useMemo } from 'react';
import { SimulatorData, LeadSession, TOTAL_STEPS, DEFAULT_SIMULATOR_DATA, DEFAULT_DEFECTS, TradeInModel, SaleModel } from '@/types/simulator';
import { PricingRule, AppSettings } from '@/types/admin';
import { loadSession, saveSession, createSession, trackEvent } from '@/lib/lead-tracker';
import { isFirebaseConfigured } from '@/lib/firebase';
import { saveLeadSession } from '@/services/firestore';

// Dynamic quote calculator that uses provided rules
function calculateQuoteDynamic(
  data: SimulatorData,
  tradeInModels: TradeInModel[],
  saleModels: SaleModel[],
  pricingRules: PricingRule[]
) {
  const tradeModel = tradeInModels.find(m => m.id === data.currentModel);
  const saleModel = saleModels.find(m => m.id === data.desiredModel);

  if (!tradeModel || !saleModel || !data.currentStorage || !data.desiredStorage || !data.desiredCondition || !data.condition) {
    return null;
  }

  const storageOpt = tradeModel.storage.find(s => s.gb === data.currentStorage);
  if (!storageOpt) return null;

  const baseValue = storageOpt.tradeInValue;

  // Build lookup maps from rules
  const batteryRules = pricingRules.filter(r => r.category === 'battery');
  const conditionRules = pricingRules.filter(r => r.category === 'condition');
  const defectRules = pricingRules.filter(r => r.category === 'defect');
  const bonusRules = pricingRules.filter(r => r.category === 'bonus');
  const paymentRules = pricingRules.filter(r => r.category === 'payment');

  // Battery deduction
  let batteryRate = 0;
  const health = data.batteryHealth;
  if (health >= 90) batteryRate = batteryRules.find(r => r.key === '90-100')?.value ?? 0;
  else if (health >= 80) batteryRate = batteryRules.find(r => r.key === '80-89')?.value ?? 0.05;
  else if (health >= 70) batteryRate = batteryRules.find(r => r.key === '70-79')?.value ?? 0.12;
  else if (health >= 60) batteryRate = batteryRules.find(r => r.key === '60-69')?.value ?? 0.20;
  else if (health >= 50) batteryRate = batteryRules.find(r => r.key === '50-59')?.value ?? 0.30;
  else batteryRate = batteryRules.find(r => r.key === 'below-50')?.value ?? 0.40;

  const batteryDeduction = Math.round(baseValue * batteryRate);

  // Condition deduction
  const conditionRate = conditionRules.find(r => r.key === data.condition)?.value ?? 0;
  const conditionDeduction = Math.round(baseValue * conditionRate);

  // Defects deduction
  let defectsTotal = 0;
  let boxBonus = 0;
  let invoiceBonus = 0;
  const defects = data.defects;

  const getDefectRate = (key: string) => defectRules.find(r => r.key === key)?.value ?? 0;
  const getBonusRate = (key: string) => bonusRules.find(r => r.key === key)?.value ?? 0;

  if (defects.faceIdWorks === false) defectsTotal += getDefectRate('faceIdWorks');
  if (defects.camerasWorking === false) defectsTotal += getDefectRate('camerasWorking');
  if (defects.deepScratches === true) defectsTotal += getDefectRate('deepScratches');
  if (defects.crackedScreen === true) defectsTotal += getDefectRate('crackedScreen');
  if (defects.scratchedScreen === true) defectsTotal += getDefectRate('scratchedScreen');
  if (defects.crackedBack === true) defectsTotal += getDefectRate('crackedBack');
  if (defects.dentedSides === true) defectsTotal += getDefectRate('dentedSides');
  if (defects.previousRepair === true) defectsTotal += getDefectRate('previousRepair');
  if (defects.hasBox === true) boxBonus = Math.round(baseValue * getBonusRate('hasBox'));
  if (defects.hasInvoice === true) invoiceBonus = Math.round(baseValue * getBonusRate('hasInvoice'));

  const defectsDeduction = Math.round(baseValue * defectsTotal);
  const finalTradeInValue = Math.max(0, baseValue - batteryDeduction - conditionDeduction - defectsDeduction + boxBonus + invoiceBonus);

  // Desired phone price
  const saleStorage = saleModel.storage.find(s => s.gb === data.desiredStorage);
  if (!saleStorage) return null;

  const desiredPhonePrice = data.desiredCondition === 'sealed' ? saleStorage.sealedPrice : saleStorage.usedPrice;

  // Payment adjustment
  const paymentRule = paymentRules.find(r => r.key === data.paymentMethod);
  const paymentAdjustment = paymentRule ? Math.round(desiredPhonePrice * paymentRule.value) : 0;

  const difference = desiredPhonePrice + paymentAdjustment - finalTradeInValue;

  return {
    currentPhoneBaseValue: baseValue,
    batteryDeduction,
    conditionDeduction,
    defectsDeduction,
    boxBonus,
    invoiceBonus,
    finalTradeInValue,
    desiredPhonePrice,
    difference: Math.max(0, difference),
  };
}

interface UseSimulatorOptions {
  tradeInModels: TradeInModel[];
  saleModels: SaleModel[];
  pricingRules: PricingRule[];
  settings: AppSettings | null;
}

export function useSimulator(options?: UseSimulatorOptions) {
  const [session, setSession] = useState<LeadSession>(() => {
    return loadSession() || createSession();
  });

  const currentStep = session.currentStep;
  const data = session.data;

  // Persist on every change
  useEffect(() => {
    saveSession(session);
    // Also sync to Firebase if configured
    if (isFirebaseConfigured()) {
      saveLeadSession(session.sessionId, {
        ...session.data,
        currentStep: session.currentStep,
        lastCompletedStep: session.lastCompletedStep,
        completed: session.completed,
        utm: session.utm,
        referrer: session.referrer,
        landingPage: session.landingPage,
        startedAt: session.startedAt,
        status: session.completed ? 'novo' : 'abandonado',
        name: session.data.name,
        phone: session.data.phone,
        batteryHealth: session.data.batteryHealth,
      }).catch(console.error);
    }
  }, [session]);

  const updateData = useCallback((updates: Partial<SimulatorData>) => {
    setSession(prev => ({
      ...prev,
      data: { ...prev.data, ...updates },
      lastInteraction: new Date().toISOString(),
    }));
  }, []);

  const updateDefect = useCallback((key: string, value: boolean) => {
    setSession(prev => ({
      ...prev,
      data: {
        ...prev.data,
        defects: { ...prev.data.defects, [key]: value },
      },
      lastInteraction: new Date().toISOString(),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setSession(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)),
      lastCompletedStep: Math.max(prev.lastCompletedStep, step - 1),
    }));
    trackEvent('step_view', { step });
  }, []);

  const nextStep = useCallback(() => {
    setSession(prev => {
      const next = Math.min(prev.currentStep + 1, TOTAL_STEPS);
      trackEvent('step_complete', { step: prev.currentStep });
      return {
        ...prev,
        currentStep: next,
        lastCompletedStep: Math.max(prev.lastCompletedStep, prev.currentStep),
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setSession(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  const markCompleted = useCallback(() => {
    setSession(prev => ({
      ...prev,
      completed: true,
      lastCompletedStep: TOTAL_STEPS - 1,
    }));
    trackEvent('simulation_completed');
  }, []);

  const resetSimulator = useCallback(() => {
    const newSession = createSession();
    setSession(newSession);
  }, []);

  const quote = useMemo(() => {
    if (options) {
      return calculateQuoteDynamic(data, options.tradeInModels, options.saleModels, options.pricingRules);
    }
    // Fallback to static calculator
    const { calculateQuote } = require('@/lib/quote-calculator');
    return calculateQuote(data);
  }, [data, options]);

  return {
    sessionId: session.sessionId,
    currentStep,
    data,
    quote,
    totalSteps: TOTAL_STEPS,
    updateData,
    updateDefect,
    goToStep,
    nextStep,
    prevStep,
    markCompleted,
    resetSimulator,
  };
}
