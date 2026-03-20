import { useState, useMemo, useCallback } from 'react';
import { AdminLead, LeadStatus, LeadNote, StatusChange } from '@/types/admin';
import { MOCK_LEADS } from '@/data/admin-mock';

export function useAdminLeads() {
  const [leads, setLeads] = useState<AdminLead[]>(MOCK_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [conditionFilter, setConditionFilter] = useState<'all' | 'sealed' | 'used'>('all');

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (completionFilter === 'complete' && !l.completed) return false;
      if (completionFilter === 'incomplete' && l.completed) return false;
      if (conditionFilter !== 'all' && l.desiredCondition !== conditionFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = l.name.toLowerCase().includes(q);
        const matchPhone = l.phone.includes(q);
        if (!matchName && !matchPhone) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime());
  }, [leads, searchQuery, statusFilter, completionFilter, conditionFilter]);

  const updateLeadStatus = useCallback((sessionId: string, newStatus: LeadStatus) => {
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
  }, []);

  const addNote = useCallback((sessionId: string, text: string) => {
    setLeads(prev => prev.map(l => {
      if (l.sessionId !== sessionId) return l;
      const note: LeadNote = { id: crypto.randomUUID(), text, author: 'Admin', createdAt: new Date().toISOString() };
      return { ...l, notes: [...l.notes, note] };
    }));
  }, []);

  const getLead = useCallback((sessionId: string) => leads.find(l => l.sessionId === sessionId) || null, [leads]);

  return {
    leads: filtered,
    allLeads: leads,
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    completionFilter, setCompletionFilter,
    conditionFilter, setConditionFilter,
    updateLeadStatus,
    addNote,
    getLead,
  };
}
