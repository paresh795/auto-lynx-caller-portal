
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Campaign {
  campaign_id: string;
  total: number;
  completed: number;
  failed: number;
  success_pct: number;
  last_activity: string;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now - in real implementation, this would come from Supabase
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        campaign_id: 'ALX-20241130-A1B2C3',
        total: 45,
        completed: 32,
        failed: 3,
        success_pct: 88.9,
        last_activity: '2024-11-30T14:30:00Z'
      },
      {
        campaign_id: 'ALX-20241130-D4E5F6',
        total: 28,
        completed: 28,
        failed: 0,
        success_pct: 100.0,
        last_activity: '2024-11-30T12:15:00Z'
      },
      {
        campaign_id: 'ALX-20241129-G7H8I9',
        total: 50,
        completed: 41,
        failed: 7,
        success_pct: 82.0,
        last_activity: '2024-11-29T16:45:00Z'
      }
    ];

    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (campaign: Campaign) => {
    const inProgress = campaign.total - campaign.completed - campaign.failed;
    
    if (inProgress > 0) {
      return <Badge className="bg-status-calling text-white">In Progress</Badge>;
    } else if (campaign.failed === 0) {
      return <Badge className="bg-status-done text-white">Completed</Badge>;
    } else {
      return <Badge className="bg-status-failed text-white">Completed with Errors</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-2 text-gray-600">
            Monitor your outbound calling campaigns and track performance.
          </p>
        </div>
        <Button asChild className="bg-brand-primary hover:bg-brand-secondary">
          <Link to="/upload">Start New Campaign</Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6">
              Start your first calling campaign by uploading contacts.
            </p>
            <Button asChild className="bg-brand-primary hover:bg-brand-secondary">
              <Link to="/upload">Create Campaign</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {campaigns.map((campaign) => {
            const inProgress = campaign.total - campaign.completed - campaign.failed;
            const progressPercentage = ((campaign.completed + campaign.failed) / campaign.total) * 100;
            
            return (
              <Card key={campaign.campaign_id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {campaign.campaign_id}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Last activity: {formatDate(campaign.last_activity)}
                      </p>
                    </div>
                    {getStatusBadge(campaign)}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progressPercentage)}% complete</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{campaign.total}</div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{campaign.completed}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">{inProgress}</div>
                        <div className="text-xs text-gray-600">In Progress</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{campaign.failed}</div>
                        <div className="text-xs text-gray-600">Failed</div>
                      </div>
                    </div>

                    {/* Success Rate */}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium text-gray-700">Success Rate</span>
                      <span className="text-lg font-bold text-brand-primary">{campaign.success_pct}%</span>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/campaigns/${campaign.campaign_id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
