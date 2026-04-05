import { useState, useEffect, useCallback, useMemo } from 'react';
import { isFirebaseConfigured } from '@/lib/firebase';
import { AdminLead, LeadStatus, LeadNote, StatusChange } from '@/types/admin';
import { MOCK_LEADS } from '@/data/admin-mock';
import { onLeads, updateLeadStatusFirestore, addLeadNote as addLeadNoteFirestore } from '@/services/firestore';

export function useFirebaseLeads() {
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [conditionFilter, setConditionFilter] = useState<'all' | 'sealed' | 'used'>('all');
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseReady) {
      setLeads(MOCK_LEADS);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = onLeads(l => {
      setLeads(l);
      setLoading(false);
    });

    return unsub;
  }, [firebaseReady]);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (completionFilter === 'complete' && !l.completed) return false;
      if (completionFilter === 'incomplete' && l.completed) return false;
      if (conditionFilter !== 'all' && l.desiredCondition !== conditionFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = l.name?.toLowerCase().includes(q);
        const matchPhone = l.phone?.includes(q);
        if (!matchName && !matchPhone) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime());
  }, [leads, searchQuery, statusFilter, completionFilter, conditionFilter]);

  const updateLeadStatus = useCallback(async (sessionId: string, newStatus: LeadStatus) => {
    if (firebaseReady) {
      const lead = leads.find(l => l.sessionId === sessionId);
      if (lead) {
        await updateLeadStatusFirestore(sessionId, newStatus, lead.status, 'Admin');
      }
    } else {
      // Local fallback
      setLeads(prev => prev.map(l => {
        if (l.sessionId !== sessionId) return l;
        const change: StatusChange = {
          id: crypto.randomUUID(),
          from: l.status,
          to: newStatus,
          author: 'Admin',
          createdAt: new Date().toISOString(),
        };
        return { ...l, status: newStatus, statusHistory: [...l.statusHistory, change] };
      }));
    }
  }, [firebaseReady, leads]);

  const addNote = useCallback(async (sessionId: string, text: string) => {
    if (firebaseReady) {
      await addLeadNoteFirestore(sessionId, text, 'Admin');
    } else {
      setLeads(prev => prev.map(l => {
        if (l.sessionId !== sessionId) return l;
        const note: LeadNote = { id: crypto.randomUUID(), text, author: 'Admin', createdAt: new Date().toISOString() };
        return { ...l, notes: [...l.notes, note] };
      }));
    }
  }, [firebaseReady]);

  const getLead = useCallback((sessionId: string) => leads.find(l => l.sessionId === sessionId) || null, [leads]);

  return {
    leads: filtered,
    allLeads: leads,
    loading,
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    completionFilter, setCompletionFilter,
    conditionFilter, setConditionFilter,
    updateLeadStatus,
    addNote,
    getLead,
    firebaseReady,
  };
}
