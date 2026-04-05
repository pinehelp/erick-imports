import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, addDoc,
  query, orderBy, where, onSnapshot, writeBatch, serverTimestamp,
  Unsubscribe, DocumentData, QueryConstraint,
} from 'firebase/firestore';
import { db, COLLECTIONS, isFirebaseConfigured } from '@/lib/firebase';
import { TradeInModel, SaleModel } from '@/types/simulator';
import { PricingRule, AppSettings, AdminLead, LeadStatus, LeadNote, StatusChange } from '@/types/admin';

// ─── Helper: check if DB is available ───
function getDb() {
  if (!db || !isFirebaseConfigured()) {
    throw new Error('Firebase not configured. Please set VITE_FIREBASE_* environment variables.');
  }
  return db;
}

// ══════════════════════════════════════════
// CATALOG - TRADE-IN MODELS
// ══════════════════════════════════════════

export async function getTradeInModels(): Promise<(TradeInModel & { active: boolean; docId: string })[]> {
  const firestore = getDb();
  const snap = await getDocs(query(collection(firestore, COLLECTIONS.CATALOG_TRADE_IN), orderBy('generation', 'asc')));
  return snap.docs.map(d => ({ docId: d.id, ...d.data() } as TradeInModel & { active: boolean; docId: string }));
}

export function onTradeInModels(callback: (models: (TradeInModel & { active: boolean; docId: string })[]) => void): Unsubscribe {
  const firestore = getDb();
  return onSnapshot(query(collection(firestore, COLLECTIONS.CATALOG_TRADE_IN), orderBy('generation', 'asc')), snap => {
    callback(snap.docs.map(d => ({ docId: d.id, ...d.data() } as TradeInModel & { active: boolean; docId: string })));
  });
}

export async function saveTradeInModel(model: TradeInModel & { active: boolean }, docId?: string): Promise<string> {
  const firestore = getDb();
  if (docId) {
    await setDoc(doc(firestore, COLLECTIONS.CATALOG_TRADE_IN, docId), model, { merge: true });
    return docId;
  }
  const ref = await addDoc(collection(firestore, COLLECTIONS.CATALOG_TRADE_IN), model);
  return ref.id;
}

export async function deleteTradeInModel(docId: string): Promise<void> {
  const firestore = getDb();
  await deleteDoc(doc(firestore, COLLECTIONS.CATALOG_TRADE_IN, docId));
}

export async function toggleTradeInModel(docId: string, active: boolean): Promise<void> {
  const firestore = getDb();
  await updateDoc(doc(firestore, COLLECTIONS.CATALOG_TRADE_IN, docId), { active });
}

// ══════════════════════════════════════════
// CATALOG - SALE MODELS
// ══════════════════════════════════════════

export async function getSaleModels(): Promise<(SaleModel & { active: boolean; docId: string })[]> {
  const firestore = getDb();
  const snap = await getDocs(query(collection(firestore, COLLECTIONS.CATALOG_SALE), orderBy('generation', 'asc')));
  return snap.docs.map(d => ({ docId: d.id, ...d.data() } as SaleModel & { active: boolean; docId: string }));
}

export function onSaleModels(callback: (models: (SaleModel & { active: boolean; docId: string })[]) => void): Unsubscribe {
  const firestore = getDb();
  return onSnapshot(query(collection(firestore, COLLECTIONS.CATALOG_SALE), orderBy('generation', 'asc')), snap => {
    callback(snap.docs.map(d => ({ docId: d.id, ...d.data() } as SaleModel & { active: boolean; docId: string })));
  });
}

export async function saveSaleModel(model: SaleModel & { active: boolean }, docId?: string): Promise<string> {
  const firestore = getDb();
  if (docId) {
    await setDoc(doc(firestore, COLLECTIONS.CATALOG_SALE, docId), model, { merge: true });
    return docId;
  }
  const ref = await addDoc(collection(firestore, COLLECTIONS.CATALOG_SALE), model);
  return ref.id;
}

export async function deleteSaleModel(docId: string): Promise<void> {
  const firestore = getDb();
  await deleteDoc(doc(firestore, COLLECTIONS.CATALOG_SALE, docId));
}

export async function toggleSaleModel(docId: string, active: boolean): Promise<void> {
  const firestore = getDb();
  await updateDoc(doc(firestore, COLLECTIONS.CATALOG_SALE, docId), { active });
}

// ══════════════════════════════════════════
// PRICING RULES
// ══════════════════════════════════════════

export async function getPricingRules(): Promise<PricingRule[]> {
  const firestore = getDb();
  const snap = await getDocs(collection(firestore, COLLECTIONS.PRICING_RULES));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as PricingRule));
}

export function onPricingRules(callback: (rules: PricingRule[]) => void): Unsubscribe {
  const firestore = getDb();
  return onSnapshot(collection(firestore, COLLECTIONS.PRICING_RULES), snap => {
    callback(snap.docs.map(d => ({ ...d.data(), id: d.id } as PricingRule)));
  });
}

export async function savePricingRule(rule: PricingRule): Promise<void> {
  const firestore = getDb();
  await setDoc(doc(firestore, COLLECTIONS.PRICING_RULES, rule.id), rule);
}

export async function savePricingRulesBatch(rules: PricingRule[]): Promise<void> {
  const firestore = getDb();
  const batch = writeBatch(firestore);
  rules.forEach(rule => {
    batch.set(doc(firestore, COLLECTIONS.PRICING_RULES, rule.id), rule);
  });
  await batch.commit();
}

// ══════════════════════════════════════════
// APP SETTINGS
// ══════════════════════════════════════════

const SETTINGS_DOC_ID = 'global';

export async function getAppSettings(): Promise<AppSettings | null> {
  const firestore = getDb();
  const snap = await getDoc(doc(firestore, COLLECTIONS.APP_SETTINGS, SETTINGS_DOC_ID));
  return snap.exists() ? (snap.data() as AppSettings) : null;
}

export function onAppSettings(callback: (settings: AppSettings | null) => void): Unsubscribe {
  const firestore = getDb();
  return onSnapshot(doc(firestore, COLLECTIONS.APP_SETTINGS, SETTINGS_DOC_ID), snap => {
    callback(snap.exists() ? (snap.data() as AppSettings) : null);
  });
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  const firestore = getDb();
  await setDoc(doc(firestore, COLLECTIONS.APP_SETTINGS, SETTINGS_DOC_ID), settings);
}

// ══════════════════════════════════════════
// LEADS
// ══════════════════════════════════════════

export async function getLeads(): Promise<AdminLead[]> {
  const firestore = getDb();
  const snap = await getDocs(query(collection(firestore, COLLECTIONS.LEAD_SESSIONS), orderBy('lastInteraction', 'desc')));
  return snap.docs.map(d => ({ ...d.data(), sessionId: d.id } as AdminLead));
}

export function onLeads(callback: (leads: AdminLead[]) => void): Unsubscribe {
  const firestore = getDb();
  return onSnapshot(query(collection(firestore, COLLECTIONS.LEAD_SESSIONS), orderBy('lastInteraction', 'desc')), snap => {
    callback(snap.docs.map(d => ({ ...d.data(), sessionId: d.id } as AdminLead)));
  });
}

export async function saveLead(lead: Partial<AdminLead> & { sessionId: string }): Promise<void> {
  const firestore = getDb();
  const { sessionId, ...data } = lead;
  await setDoc(doc(firestore, COLLECTIONS.LEAD_SESSIONS, sessionId), data, { merge: true });
}

export async function updateLeadStatusFirestore(
  sessionId: string,
  newStatus: LeadStatus,
  oldStatus: LeadStatus,
  author: string
): Promise<void> {
  const firestore = getDb();
  const leadRef = doc(firestore, COLLECTIONS.LEAD_SESSIONS, sessionId);
  
  // Update lead status
  await updateDoc(leadRef, { status: newStatus });
  
  // Add status change to history
  const historyEntry: Omit<StatusChange, 'id'> = {
    id: crypto.randomUUID(),
    from: oldStatus,
    to: newStatus,
    author,
    createdAt: new Date().toISOString(),
  };
  
  await addDoc(collection(firestore, COLLECTIONS.LEAD_STATUS_HISTORY), {
    sessionId,
    ...historyEntry,
  });
}

export async function addLeadNote(sessionId: string, text: string, author: string): Promise<void> {
  const firestore = getDb();
  await addDoc(collection(firestore, COLLECTIONS.LEAD_NOTES), {
    sessionId,
    text,
    author,
    createdAt: new Date().toISOString(),
  });
}

// ══════════════════════════════════════════
// LEAD SESSION (public-facing save)
// ══════════════════════════════════════════

export async function saveLeadSession(sessionId: string, data: DocumentData): Promise<void> {
  const firestore = getDb();
  await setDoc(doc(firestore, COLLECTIONS.LEAD_SESSIONS, sessionId), {
    ...data,
    lastInteraction: new Date().toISOString(),
  }, { merge: true });
}

// ══════════════════════════════════════════
// SEED DATA (initial setup)
// ══════════════════════════════════════════

export async function seedInitialData(
  tradeInModels: (TradeInModel & { active: boolean })[],
  saleModels: (SaleModel & { active: boolean })[],
  pricingRules: PricingRule[],
  settings: AppSettings
): Promise<void> {
  const firestore = getDb();
  const batch = writeBatch(firestore);

  // Catalog trade-in
  tradeInModels.forEach(model => {
    batch.set(doc(firestore, COLLECTIONS.CATALOG_TRADE_IN, model.id), model);
  });

  // Catalog sale
  saleModels.forEach(model => {
    batch.set(doc(firestore, COLLECTIONS.CATALOG_SALE, model.id), model);
  });

  // Pricing rules
  pricingRules.forEach(rule => {
    batch.set(doc(firestore, COLLECTIONS.PRICING_RULES, rule.id), rule);
  });

  // Settings
  batch.set(doc(firestore, COLLECTIONS.APP_SETTINGS, SETTINGS_DOC_ID), settings);

  await batch.commit();
}
