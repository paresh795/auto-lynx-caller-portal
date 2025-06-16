
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CsvDropZone from '@/components/CsvDropZone';
import InlineChat from '@/components/InlineChat';

const Upload = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [chatMode, setChatMode] = useState(() => {
    return localStorage.getItem('chatMode') || 'inline';
  });

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
    setIsUploading(true);
    
    try {
      console.log('Submitting inline chat data:', data);
      
      const response = await fetch('https://pranaut.app.n8n.cloud/webhook/999f6676-738f-478a-95ec-246b01d71e24', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: JSON.stringify(data),
          sessionId: crypto.randomUUID()
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
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Contacts</h1>
        <p className="mt-2 text-gray-600">
          Start a new calling campaign by uploading a CSV file or entering contacts manually.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CSV Upload */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📁</span>
              <span>CSV Upload</span>
            </CardTitle>
            <CardDescription>
              Upload a CSV file with contact information. Maximum 50 contacts per campaign.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CsvDropZone onUpload={handleCsvUpload} isLoading={isUploading} />
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Required CSV format:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>name</strong> - Contact name (2-64 characters)</div>
                <div><strong>phone</strong> - Phone number in E.164 format (+1234567890)</div>
                <div><strong>business_name</strong> - Company name (optional)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inline Chat */}
        {chatMode === 'inline' && (
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>💬</span>
                <span>Chat Input</span>
              </CardTitle>
              <CardDescription>
                Paste or type your contact list directly. One contact per line.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InlineChat onSubmit={handleInlineChatSubmit} isLoading={isUploading} />
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
                  Click the chat widget to start a conversation and upload contacts.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setChatMode('inline');
                    localStorage.setItem('chatMode', 'inline');
                  }}
                >
                  Switch to Inline Chat
                </Button>
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
