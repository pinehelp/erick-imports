import { LeadSession, SimulatorData, DEFAULT_SIMULATOR_DATA, QuoteResult, UtmParams } from '@/types/simulator';

const SESSION_KEY = 'iphone-upgrade-session';

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function getUtmParams(): UtmParams {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  };
}

export function loadSession(): LeadSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(session: LeadSession): void {
  try {
    session.lastInteraction = new Date().toISOString();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

export function createSession(): LeadSession {
  return {
    sessionId: generateSessionId(),
    startedAt: new Date().toISOString(),
    lastInteraction: new Date().toISOString(),
    currentStep: 0,
    lastCompletedStep: -1,
    completed: false,
    data: { ...DEFAULT_SIMULATOR_DATA },
    quote: null,
    utm: getUtmParams(),
    referrer: document.referrer || '',
    landingPage: window.location.href,
  };
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Firebase Integration Placeholder ───
// These functions are structured for easy Firebase migration.
// Replace localStorage calls with Firestore writes.

export async function syncSessionToFirebase(_session: LeadSession): Promise<void> {
  // TODO: Firestore integration
  // const docRef = doc(db, 'lead_sessions', session.sessionId);
  // await setDoc(docRef, session, { merge: true });
  console.log('[Firebase] Session sync placeholder');
}

export async function trackEvent(_eventName: string, _params?: Record<string, unknown>): Promise<void> {
  // TODO: Firebase Analytics
  // logEvent(analytics, eventName, params);
  console.log(`[Analytics] ${_eventName}`, _params);
}

// ─── Firestore Collection Structure ───
/*
Collections planned:
- lead_sessions/{sessionId}        → LeadSession document
- lead_quotes/{sessionId}          → QuoteResult + metadata
- catalog_models/{modelId}         → Model catalog (admin-editable)
- pricing_rules/{ruleId}           → Pricing configuration
- admins/{uid}                     → Admin user profiles

Subcollections:
- lead_sessions/{id}/events        → Funnel tracking events
- lead_sessions/{id}/photos        → Uploaded photo metadata
*/
