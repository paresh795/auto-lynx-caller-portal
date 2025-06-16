
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalCampaigns: number;
  totalCalls: number;
  successRate: number;
  averageDuration: number;
  todaysCalls: number;
  activeCampaigns: number;
  trendData: Array<{
    date: string;
    calls: number;
    success: number;
  }>;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    totalCalls: 0,
    successRate: 0,
    averageDuration: 0,
    todaysCalls: 0,
    activeCampaigns: 0,
    trendData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard stats...');

      // Fetch all campaigns
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*');

      if (campaignsError) {
        console.error('Error fetching campaigns:', campaignsError);
        throw campaignsError;
      }

      console.log('Campaigns data:', campaigns);

      // Fetch all contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('last_called_at', { ascending: false });

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
        throw contactsError;
      }

      console.log('Contacts data:', contacts);

      // Calculate real stats from actual data
      const totalCampaigns = campaigns?.length || 0;
      const totalCalls = contacts?.length || 0;
      
      const completedCalls = contacts?.filter(c => c.status === 'DONE').length || 0;
      const failedCalls = contacts?.filter(c => c.status === 'FAILED').length || 0;
      const callingCalls = contacts?.filter(c => c.status === 'CALLING').length || 0;
      const newCalls = contacts?.filter(c => c.status === 'NEW').length || 0;
      
      console.log('Call status breakdown:', {
        total: totalCalls,
        completed: completedCalls,
        failed: failedCalls,
        calling: callingCalls,
        new: newCalls
      });
      
      const successRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;
      
      // Today's calls (contacts that have been called today)
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayISO = todayStart.toISOString();
      
      const todaysCalls = contacts?.filter(c => 
        c.last_called_at && new Date(c.last_called_at) >= todayStart
      ).length || 0;

      console.log('Today\'s calls calculation:', {
        todayStart: todayISO,
        todaysCalls,
        contactsWithCalls: contacts?.filter(c => c.last_called_at).length
      });

      // Active campaigns (campaigns that have contacts not yet completed)
      const campaignIds = new Set(contacts?.map(c => c.campaign_id).filter(Boolean));
      let activeCampaigns = 0;
      
      campaignIds.forEach(campaignId => {
        const campaignContacts = contacts?.filter(c => c.campaign_id === campaignId) || [];
        const unfinishedContacts = campaignContacts.filter(c => 
          c.status === 'NEW' || c.status === 'CALLING'
        );
        if (unfinishedContacts.length > 0) {
          activeCampaigns++;
        }
      });

      console.log('Active campaigns calculation:', {
        totalCampaignIds: campaignIds.size,
        activeCampaigns
      });

      // Calculate average duration from actual transcript data
      let averageDuration = 0;
      const contactsWithDuration = contacts?.filter(c => 
        c.transcript && 
        typeof c.transcript === 'object' && 
        c.transcript.duration
      ) || [];
      
      if (contactsWithDuration.length > 0) {
        const totalDuration = contactsWithDuration.reduce((sum, c) => {
          return sum + (c.transcript.duration || 0);
        }, 0);
        averageDuration = Math.round(totalDuration / contactsWithDuration.length);
      }

      console.log('Duration calculation:', {
        contactsWithDuration: contactsWithDuration.length,
        averageDuration
      });

      // Generate trend data from actual call data
      const trendData = generateTrendData(contacts || []);

      const finalStats = {
        totalCampaigns,
        totalCalls,
        successRate,
        averageDuration,
        todaysCalls,
        activeCampaigns,
        trendData
      };

      console.log('Final calculated stats:', finalStats);
      setStats(finalStats);

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const generateTrendData = (contacts: any[]) => {
    // Get the last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }

    return days.map(date => {
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(dateStart);
      dateEnd.setDate(dateEnd.getDate() + 1);
      
      const dayContacts = contacts.filter(c => 
        c.last_called_at && 
        new Date(c.last_called_at) >= dateStart && 
        new Date(c.last_called_at) < dateEnd
      );
      
      const totalCalls = dayContacts.length;
      const successfulCalls = dayContacts.filter(c => c.status === 'DONE').length;
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
        calls: totalCalls,
        success: successfulCalls
      };
    });
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time subscription
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns'
        },
        () => {
          console.log('Campaign change detected, refreshing stats');
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts'
        },
        () => {
          console.log('Contact change detected, refreshing stats');
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};
