import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCampaigns } from '@/hooks/useCampaigns';

const Campaigns = () => {
  const { campaigns, loading, error } = useCampaigns();

  const getStatusBadge = (campaign: any) => {
    const inProgress = campaign.total - campaign.completed - campaign.failed;
    
    if (inProgress > 0) {
      return <Badge className="bg-status-calling text-white">In Progress</Badge>;
    } else if (campaign.failed === 0) {
      return <Badge className="bg-status-done text-white">Completed</Badge>;
    } else {
      return <Badge className="bg-status-failed text-white">Completed with Errors</Badge>;
    }
  };

  const formatCampaignName = (campaignId: string) => {
    // Extract date and time from campaign ID for display
    const patterns = [
      { regex: /ALX-(\d{8})-(\d{6})/, type: 'datetime' },  // ALX-20240613-181950
      { regex: /ALX-(\d{8})-([A-F0-9]{6})/, type: 'date' },  // ALX-20240613-B2A7F0
      { regex: /ALX-(\d{2})-(\d{6})/, type: 'legacy' },  // ALX-13-181950
    ];
    
    for (const pattern of patterns) {
      const match = campaignId.match(pattern.regex);
      if (match) {
        const [, datePart, timePart] = match;
        
        if (pattern.type === 'datetime' && datePart.length === 8) {
          // Format: ALX-20240613-181950 -> ALX - Jun 13, 2024 at 6:19 PM
          const year = parseInt(datePart.substring(0, 4));
          const month = parseInt(datePart.substring(4, 6)) - 1;
          const day = parseInt(datePart.substring(6, 8));
          const hour = parseInt(timePart.substring(0, 2));
          const minute = parseInt(timePart.substring(2, 4));
          
          const date = new Date(year, month, day, hour, minute);
          const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          const formattedTime = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          });
          
          return `ALX - ${formattedDate} at ${formattedTime}`;
        } else if (pattern.type === 'date' && datePart.length === 8) {
          // Format: ALX-20240613-B2A7F0 -> ALX - Jun 13, 2024
          const year = parseInt(datePart.substring(0, 4));
          const month = parseInt(datePart.substring(4, 6)) - 1;
          const day = parseInt(datePart.substring(6, 8));
          
          const date = new Date(year, month, day);
          const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          
          return `ALX - ${formattedDate}`;
        } else if (pattern.type === 'legacy') {
          // Format: ALX-13-181950 -> ALX - Day 13 at 6:19 PM
          const day = parseInt(datePart);
          const hour = parseInt(timePart.substring(0, 2));
          const minute = parseInt(timePart.substring(2, 4));
          
          const time = new Date();
          time.setHours(hour, minute);
          const formattedTime = time.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          });
          
          return `ALX - Day ${day} at ${formattedTime}`;
        }
      }
    }
    
    // Fallback to original campaign ID
    return campaignId;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'No activity yet';
      }
      
      // Check if date is the Unix epoch (1969/1970) which indicates NULL
      if (date.getFullYear() < 1990) {
        return 'No activity yet';
      }
      
      // Format consistently: MM/DD/YYYY, HH:MM AM/PM
      return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-2 text-gray-600">
            Monitor your outbound calling campaigns and track performance.
          </p>
        </div>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-lg mb-2">⚠️ Error Loading Campaigns</div>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                        {formatCampaignName(campaign.campaign_id)}
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
