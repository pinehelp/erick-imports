import { useState, useEffect, useCallback } from 'react';
import { isFirebaseConfigured } from '@/lib/firebase';
import { TradeInModel, SaleModel } from '@/types/simulator';
import { PricingRule, AppSettings } from '@/types/admin';
import {
  onTradeInModels, onSaleModels, onPricingRules, onAppSettings,
  saveTradeInModel, deleteTradeInModel, toggleTradeInModel,
  saveSaleModel, deleteSaleModel, toggleSaleModel,
  savePricingRulesBatch, saveAppSettings,
} from '@/services/firestore';
import {
  TRADE_IN_MODELS as LOCAL_TRADE_IN,
  SALE_MODELS as LOCAL_SALE,
} from '@/data/catalog';
import { MOCK_PRICING_RULES, MOCK_SETTINGS } from '@/data/admin-mock';

// Type with active flag and docId
export type TradeInModelDoc = TradeInModel & { active: boolean; docId: string };
export type SaleModelDoc = SaleModel & { active: boolean; docId: string };

// ══════════════════════════════════════════
// CATALOG HOOK
// ══════════════════════════════════════════

export function useCatalog() {
  const [tradeInModels, setTradeInModels] = useState<TradeInModelDoc[]>([]);
  const [saleModels, setSaleModels] = useState<SaleModelDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseReady) {
      // Fallback to local data
      setTradeInModels(LOCAL_TRADE_IN.map(m => ({ ...m, active: true, docId: m.id })));
      setSaleModels(LOCAL_SALE.map(m => ({ ...m, active: true, docId: m.id })));
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub1 = onTradeInModels(models => {
      setTradeInModels(models);
      setLoading(false);
    });
    const unsub2 = onSaleModels(models => {
      setSaleModels(models);
    });

    return () => { unsub1(); unsub2(); };
  }, [firebaseReady]);

  // Only return active models for public use
  const activeTradeInModels = tradeInModels.filter(m => m.active);
  const activeSaleModels = saleModels.filter(m => m.active);

  const addTradeIn = useCallback(async (model: TradeInModel & { active: boolean }) => {
    if (!firebaseReady) {
      setTradeInModels(prev => [...prev, { ...model, docId: model.id }]);
      return;
    }
    await saveTradeInModel(model);
  }, [firebaseReady]);

  const updateTradeIn = useCallback(async (docId: string, model: TradeInModel & { active: boolean }) => {
    if (!firebaseReady) {
      setTradeInModels(prev => prev.map(m => m.docId === docId ? { ...model, docId } : m));
      return;
    }
    await saveTradeInModel(model, docId);
  }, [firebaseReady]);

  const removeTradeIn = useCallback(async (docId: string) => {
    if (!firebaseReady) {
      setTradeInModels(prev => prev.filter(m => m.docId !== docId));
      return;
    }
    await deleteTradeInModel(docId);
  }, [firebaseReady]);

  const toggleTradeIn = useCallback(async (docId: string, active: boolean) => {
    if (!firebaseReady) {
      setTradeInModels(prev => prev.map(m => m.docId === docId ? { ...m, active } : m));
      return;
    }
    await toggleTradeInModel(docId, active);
  }, [firebaseReady]);

  const addSale = useCallback(async (model: SaleModel & { active: boolean }) => {
    if (!firebaseReady) {
      setSaleModels(prev => [...prev, { ...model, docId: model.id }]);
      return;
    }
    await saveSaleModel(model);
  }, [firebaseReady]);

  const updateSale = useCallback(async (docId: string, model: SaleModel & { active: boolean }) => {
    if (!firebaseReady) {
      setSaleModels(prev => prev.map(m => m.docId === docId ? { ...model, docId } : m));
      return;
    }
    await saveSaleModel(model, docId);
  }, [firebaseReady]);

  const removeSale = useCallback(async (docId: string) => {
    if (!firebaseReady) {
      setSaleModels(prev => prev.filter(m => m.docId !== docId));
      return;
    }
    await deleteSaleModel(docId);
  }, [firebaseReady]);

  const toggleSale = useCallback(async (docId: string, active: boolean) => {
    if (!firebaseReady) {
      setSaleModels(prev => prev.map(m => m.docId === docId ? { ...m, active } : m));
      return;
    }
    await toggleSaleModel(docId, active);
  }, [firebaseReady]);

  return {
    tradeInModels,
    saleModels,
    activeTradeInModels,
    activeSaleModels,
    loading,
    firebaseReady,
    addTradeIn, updateTradeIn, removeTradeIn, toggleTradeIn,
    addSale, updateSale, removeSale, toggleSale,
  };
}

// ══════════════════════════════════════════
// PRICING RULES HOOK
// ══════════════════════════════════════════

export function usePricingRules() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseReady) {
      setRules(MOCK_PRICING_RULES);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = onPricingRules(r => {
      setRules(r);
      setLoading(false);
    });

    return unsub;
  }, [firebaseReady]);

  const updateRule = useCallback((id: string, value: number) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, value } : r));
  }, []);

  const saveAll = useCallback(async () => {
    if (!firebaseReady) return;
    await savePricingRulesBatch(rules);
  }, [rules, firebaseReady]);

  return { rules, loading, updateRule, saveAll, firebaseReady };
}

// ══════════════════════════════════════════
// SETTINGS HOOK
// ══════════════════════════════════════════

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(MOCK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseReady) {
      setSettings(MOCK_SETTINGS);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = onAppSettings(s => {
      if (s) setSettings(s);
      setLoading(false);
    });

    return unsub;
  }, [firebaseReady]);

  const update = useCallback((key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleQuestion = useCallback((key: string) => {
    setSettings(prev => ({
      ...prev,
      questionsConfig: { ...prev.questionsConfig, [key]: !prev.questionsConfig[key] },
    }));
  }, []);

  const save = useCallback(async () => {
    if (!firebaseReady) return;
    await saveAppSettings(settings);
  }, [settings, firebaseReady]);

  return { settings, loading, update, toggleQuestion, save, firebaseReady };
}
