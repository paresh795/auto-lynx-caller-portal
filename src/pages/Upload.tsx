import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CsvDropZone from '@/components/CsvDropZone';
import InlineChat from '@/components/InlineChat';
import { useWebhookConfig } from '@/hooks/useWebhookConfig';
import { generateUUID } from '@/lib/utils';

const Upload = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [chatMode, setChatMode] = useState(() => {
    return localStorage.getItem('chatMode') || 'inline';
  });
  const { config } = useWebhookConfig();

  const handleCsvUpload = (message: string) => {
    console.log('CSV upload callback received:', message);
    
    // Show appropriate toast based on message content
    const isError = message.toLowerCase().includes('error') || message.toLowerCase().includes('failed');
    const isSuccess = message.toLowerCase().includes('success') || message.toLowerCase().includes('started');
    
    if (isSuccess) {
      toast({
        title: "Campaign Started! 🚀",
        description: message,
      });
    } else if (isError) {
      toast({
        title: "Upload Issue",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "CSV Processing",
        description: message,
      });
    }
  };

  const handleInlineChatSubmit = async (data: any[]) => {
    // Check if webhook URL is configured
    if (!config.chatWebhookUrl) {
      toast({
        title: "Configuration Required",
        description: "Please configure the chat webhook URL in Settings before using inline chat.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('Submitting inline chat data:', data);
      console.log('Using webhook URL:', config.chatWebhookUrl);
      
      const response = await fetch(config.chatWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: JSON.stringify(data),
          sessionId: generateUUID()
        }),
      });

      console.log('Inline chat response status:', response.status);
      
      const result = await response.json();
      console.log('Inline chat response data:', result);
      
      if (response.ok) {
        toast({
          title: "Campaign Started! 🚀",
          description: result.message || "Your campaign has been queued successfully.",
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Inline chat submission error:', error);
      
      let errorMessage = "Something went wrong";
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = "Unable to connect to the chat webhook. Please check your webhook URL configuration in Settings.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Contacts</h1>
        <p className="mt-2 text-gray-600">
          Start a new calling campaign by uploading a CSV file or entering contacts manually.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* CSV Upload */}
        <Card className="rounded-xl shadow-sm h-[900px] overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <span>📁</span>
              <span>CSV Upload</span>
            </CardTitle>
            <CardDescription>
              Upload a CSV file with contact information. Maximum 50 contacts per campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-[730px] p-6">
            <div className="flex-1 mb-6">
              <CsvDropZone onUpload={handleCsvUpload} isLoading={isUploading} />
            </div>
            
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Required CSV format:
              </h4>
              <div className="text-sm space-y-2">
                <div className="flex items-center">
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs mr-2">name</span>
                  <span className="text-gray-700">Contact name (2-64 characters)</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded text-xs mr-2">phone</span>
                  <span className="text-gray-700">Phone number in E.164 format (+1234567890)</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs mr-2">business_name</span>
                  <span className="text-gray-700">Company name (optional)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inline Chat */}
        {chatMode === 'inline' && (
          <Card className="rounded-xl shadow-sm h-[900px] overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <span>💬</span>
                <span>Chat Input</span>
              </CardTitle>
              <CardDescription>
                Paste or type your contact list directly. One contact per line.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[730px] p-6">
              {config.chatWebhookUrl ? (
                <InlineChat onSubmit={handleInlineChatSubmit} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">⚙️</div>
                    <p className="text-gray-600 mb-4">
                      Chat webhook URL not configured.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/settings'}
                    >
                      Configure in Settings
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Chat Widget Info */}
        {chatMode === 'widget' && (
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔗</span>
                <span>Chat Widget Active</span>
              </CardTitle>
              <CardDescription>
                You're using the floating chat widget. Look for the chat bubble in the bottom right corner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💭</div>
                <p className="text-gray-600">
                  {config.chatWebhookUrl 
                    ? "Click the chat widget to start a conversation and upload contacts."
                    : "Please configure the chat webhook URL in Settings first."
                  }
                </p>
                <div className="space-y-2 mt-4">
                  {!config.chatWebhookUrl && (
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/settings'}
                    >
                      Configure Webhook
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setChatMode('inline');
                      localStorage.setItem('chatMode', 'inline');
                    }}
                  >
                    Switch to Inline Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Campaigns Preview */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🕒</span>
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="text-2xl mb-2">📋</div>
            <p>Your recent campaigns will appear here once you start uploading contacts.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
