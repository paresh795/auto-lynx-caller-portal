import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { getBranding } from '@/lib/utils';

const Index = () => {
  const { stats, loading } = useDashboardStats();
  const branding = getBranding();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Welcome to <span className="text-brand-primary">{branding.companyName}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {branding.appDescription}. Upload contacts, monitor progress in real-time, and track performance with ease.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-secondary text-lg">
            <Link to="/upload">Start New Campaign</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg">
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">📤</div>
            <CardTitle>Easy Upload</CardTitle>
            <CardDescription>
              Upload contacts via CSV or paste them directly into our chat interface
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline" className="w-full">
              <Link to="/upload">Upload Contacts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <CardTitle>Real-time Monitoring</CardTitle>
            <CardDescription>
              Watch your campaigns progress live with automatic status updates
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline" className="w-full">
              <Link to="/campaigns">View Campaigns</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>
              Track success rates, call duration, and campaign effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-600 mt-2">Get started with {branding.companyName} in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Upload Contacts</h3>
            <p className="text-gray-600">
              Upload your contact list via CSV file or paste them directly into our chat interface. 
              Maximum 50 contacts per campaign.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Monitor Progress</h3>
            <p className="text-gray-600">
              Watch your campaign progress in real-time. See call status updates, success rates, 
              and individual contact progress.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Review Results</h3>
            <p className="text-gray-600">
              Access detailed transcripts, performance metrics, and analytics to optimize 
              your future campaigns.
            </p>
          </div>
        </div>
      </div>

      {/* Real Stats Preview */}
      <Card className="rounded-xl shadow-sm bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <CardContent className="p-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 bg-white/20 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{stats.totalCalls}</div>
                <div className="text-sm opacity-90">Total Calls Made</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.successRate}%</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.totalCampaigns}</div>
                <div className="text-sm opacity-90">Campaigns Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  ${stats.totalCost.toFixed(2)}
                </div>
                <div className="text-sm opacity-90">Total Spend</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to boost your outbound calling?
        </h2>
        <p className="text-xl text-gray-600">
          Start your first campaign today and see the difference automation makes.
        </p>
        <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-secondary text-lg">
          <Link to="/upload">Get Started Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
