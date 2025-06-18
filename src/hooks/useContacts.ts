import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Contact {
  row_id: string;
  name: string;
  business_name: string;
  phone: string;
  status: 'NEW' | 'CALLING' | 'DONE' | 'FAILED';
  transcript: any;
  last_called_at: string;
  processing_order: number;
  campaign_id: string;
  recording_url?: string;
  cost?: number;
  ended_reason?: string;
  success_evaluation?: boolean;
}

export const useContacts = (campaignId?: string) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('contacts').select('*');
      
      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }
      
      const { data, error } = await query.order('processing_order', { ascending: true });

      if (error) throw error;

      setContacts(data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();

    // Set up real-time subscription
    const channel = supabase
      .channel('contacts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts',
          ...(campaignId ? { filter: `campaign_id=eq.${campaignId}` } : {})
        },
        () => {
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return { contacts, loading, error, refetch: fetchContacts };
};
