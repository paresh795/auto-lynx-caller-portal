
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

      // Fetch campaign stats
      const { data: campaignStats, error: campaignError } = await supabase
        .from('v_campaign_stats')
        .select('*');

      if (campaignError) throw campaignError;

      // Fetch all contacts for additional calculations
      const { data: allContacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('last_called_at', { ascending: false });

      if (contactsError) throw contactsError;

      // Calculate stats
      const totalCampaigns = campaignStats?.length || 0;
      const totalCalls = allContacts?.length || 0;
      
      const completedCalls = allContacts?.filter(c => c.status === 'DONE').length || 0;
      const failedCalls = allContacts?.filter(c => c.status === 'FAILED').length || 0;
      
      const successRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;
      
      // Today's calls (calls with last_called_at today)
      const today = new Date().toISOString().split('T')[0];
      const todaysCalls = allContacts?.filter(c => 
        c.last_called_at && c.last_called_at.startsWith(today)
      ).length || 0;

      // Active campaigns (campaigns with CALLING or NEW contacts)
      const activeCampaigns = campaignStats?.filter(c => 
        c.total > (c.completed + c.failed)
      ).length || 0;

      // Average duration (mock for now - would need transcript analysis)
      const averageDuration = 142;

      // Generate trend data from actual call data
      const trendData = generateTrendData(allContacts || []);

      setStats({
        totalCampaigns,
        totalCalls,
        successRate,
        averageDuration,
        todaysCalls,
        activeCampaigns,
        trendData
      });

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
      const dateStr = date.toISOString().split('T')[0];
      const dayContacts = contacts.filter(c => 
        c.last_called_at && c.last_called_at.startsWith(dateStr)
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
