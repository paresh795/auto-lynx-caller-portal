import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Campaign {
  campaign_id: string;
  total: number;
  completed: number;
  failed: number;
  success_pct: number;
  last_activity: string;
  campaign_created_at?: string;
  total_cost?: number;
  ai_successful?: number;
  ai_success_pct?: number;
  avg_cost_per_call?: number;
}

// Helper function to extract date from campaign ID for sorting
const extractDateFromCampaignId = (campaignId: string): Date => {
  // Handle both formats: ALX-YYYYMMDD-HHMMSS and ALX-20240613-B2A7F0
  const patterns = [
    /ALX-(\d{8})-(\d{6})/,  // ALX-20240613-181950
    /ALX-(\d{8})-([A-F0-9]{6})/,  // ALX-20240613-B2A7F0
    /ALX-(\d{2})-(\d{6})/,  // ALX-13-181950 (legacy format)
  ];
  
  for (const pattern of patterns) {
    const match = campaignId.match(pattern);
    if (match) {
      const [, datePart, timePart] = match;
      
      if (datePart.length === 8) {
        // YYYYMMDD format
        const year = parseInt(datePart.substring(0, 4));
        const month = parseInt(datePart.substring(4, 6)) - 1; // Month is 0-indexed
        const day = parseInt(datePart.substring(6, 8));
        
        if (timePart.length === 6 && /^\d{6}$/.test(timePart)) {
          // HHMMSS format
          const hour = parseInt(timePart.substring(0, 2));
          const minute = parseInt(timePart.substring(2, 4));
          const second = parseInt(timePart.substring(4, 6));
          return new Date(year, month, day, hour, minute, second);
        } else {
          // Hex format, use just the date
          return new Date(year, month, day);
        }
      } else if (datePart.length === 2) {
        // Legacy DD format, assume current year/month
        const now = new Date();
        const day = parseInt(datePart);
        return new Date(now.getFullYear(), now.getMonth(), day);
      }
    }
  }
  
  // Fallback to current date if no pattern matches
  return new Date();
};

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('v_campaign_stats')
        .select('*');

      if (error) throw error;

      // Sort campaigns by multiple criteria for best ordering
      const sortedCampaigns = (data || []).sort((a, b) => {
        // Primary sort: by last_activity (most recent first)
        const dateA = new Date(a.last_activity);
        const dateB = new Date(b.last_activity);
        
        // If dates are valid and different, sort by them
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime()) && dateA.getTime() !== dateB.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }
        
        // Secondary sort: by campaign ID date (extract from campaign name)
        const campaignDateA = extractDateFromCampaignId(a.campaign_id);
        const campaignDateB = extractDateFromCampaignId(b.campaign_id);
        
        return campaignDateB.getTime() - campaignDateA.getTime();
      });

      setCampaigns(sortedCampaigns);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();

    // Set up real-time subscription
    const channel = supabase
      .channel('campaigns-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns'
        },
        () => {
          fetchCampaigns();
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
          fetchCampaigns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { campaigns, loading, error, refetch: fetchCampaigns };
};
