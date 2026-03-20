import { useState, useEffect, useCallback, useMemo } from 'react';
import { SimulatorData, LeadSession, TOTAL_STEPS, DEFAULT_SIMULATOR_DATA, DEFAULT_DEFECTS } from '@/types/simulator';
import { loadSession, saveSession, createSession, trackEvent } from '@/lib/lead-tracker';
import { calculateQuote } from '@/lib/quote-calculator';

export function useSimulator() {
  const [session, setSession] = useState<LeadSession>(() => {
    return loadSession() || createSession();
  });

  const currentStep = session.currentStep;
  const data = session.data;

  // Persist on every change
  useEffect(() => {
    saveSession(session);
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

  const quote = useMemo(() => calculateQuote(data), [data]);

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
