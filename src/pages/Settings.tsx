import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useWebhookConfig } from '@/hooks/useWebhookConfig';
import { getBranding } from '@/lib/utils';

const Settings = () => {
  const [chatMode, setChatMode] = useState('inline');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [webhookUrls, setWebhookUrls] = useState({
    chatWebhookUrl: '',
    csvUploadWebhookUrl: ''
  });
  const [webhookUnsavedChanges, setWebhookUnsavedChanges] = useState(false);
  
  const { toast } = useToast();
  const { config, isLoaded, saveConfig, resetConfig } = useWebhookConfig();
  const branding = getBranding();

  useEffect(() => {
    const savedChatMode = localStorage.getItem('chatMode') || 'inline';
    setChatMode(savedChatMode);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setWebhookUrls(config);
    }
  }, [config, isLoaded]);

  const handleChatModeChange = (value: string) => {
    setChatMode(value);
    setHasUnsavedChanges(true);
  };

  const handleWebhookUrlChange = (field: string, value: string) => {
    setWebhookUrls(prev => ({
      ...prev,
      [field]: value
    }));
    setWebhookUnsavedChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('chatMode', chatMode);
    setHasUnsavedChanges(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('chatModeChanged'));
    
    toast({
      title: "Settings Saved",
      description: "Your chat preferences have been updated successfully.",
    });
  };

  const saveWebhookSettings = () => {
    const success = saveConfig(webhookUrls);
    
    if (success) {
      setWebhookUnsavedChanges(false);
      toast({
        title: "Webhook URLs Saved",
        description: "Your webhook configuration has been updated successfully.",
      });
    } else {
      toast({
        title: "Save Failed",
        description: "Failed to save webhook configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetSettings = () => {
    setChatMode('inline');
    localStorage.removeItem('chatMode');
    setHasUnsavedChanges(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('chatModeChanged'));
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const resetWebhookSettings = () => {
    const success = resetConfig();
    
    if (success) {
      setWebhookUrls({ chatWebhookUrl: '', csvUploadWebhookUrl: '' });
      setWebhookUnsavedChanges(false);
      toast({
        title: "Webhook URLs Reset",
        description: "Webhook configuration has been reset.",
      });
    } else {
      toast({
        title: "Reset Failed",
        description: "Failed to reset webhook configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure your {branding.companyName} preferences, webhook URLs, and chat options.
        </p>
      </div>

      {/* Webhook Configuration */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🔗</span>
            <span>Webhook Configuration</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Configure the webhook URLs for chat and CSV upload functionality. These URLs will be used by the application.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="chatWebhookUrl" className="text-sm font-medium text-gray-900">
                Chat Webhook URL
              </Label>
              <Input
                id="chatWebhookUrl"
                type="url"
                value={webhookUrls.chatWebhookUrl}
                onChange={(e) => handleWebhookUrlChange('chatWebhookUrl', e.target.value)}
                placeholder="https://your-webhook-domain.com/webhook/your-chat-webhook-id"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for processing chat-based contact submissions
              </p>
            </div>

            <div>
              <Label htmlFor="csvUploadWebhookUrl" className="text-sm font-medium text-gray-900">
                CSV Upload Webhook URL
              </Label>
              <Input
                id="csvUploadWebhookUrl"
                type="url"
                value={webhookUrls.csvUploadWebhookUrl}
                onChange={(e) => handleWebhookUrlChange('csvUploadWebhookUrl', e.target.value)}
                placeholder="https://your-webhook-domain.com/webhook/your-csv-webhook-id"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for processing CSV file uploads
              </p>
            </div>
          </div>

          {webhookUnsavedChanges && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-amber-600">⚠️</span>
                <span className="text-sm font-medium text-amber-800">Unsaved Webhook Changes</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                You have unsaved webhook configuration changes. Click "Save Webhook URLs" to apply them.
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={resetWebhookSettings}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Reset Webhook URLs
            </Button>
            
            <Button 
              onClick={saveWebhookSettings}
              disabled={!webhookUnsavedChanges}
              className="bg-brand-primary hover:bg-brand-secondary"
            >
              Save Webhook URLs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Settings */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>💬</span>
            <span>Chat Configuration</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Choose how you want to interact with the chat feature for uploading contacts.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={chatMode} onValueChange={handleChatModeChange}>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="inline" id="inline" className="mt-1" />
                <Label htmlFor="inline" className="flex-1 cursor-pointer">
                  <div className="font-medium text-gray-900">Inline Chat</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Show chat input directly on the Upload page. Best for focused uploading sessions.
                  </div>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                    ✅ Always visible<br/>
                    ✅ Integrated with upload flow<br/>
                    ✅ No additional setup required
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="widget" id="widget" className="mt-1" />
                <Label htmlFor="widget" className="flex-1 cursor-pointer">
                  <div className="font-medium text-gray-900">Floating Chat Widget</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Display a floating chat bubble available site-wide. Access from any page.
                  </div>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                    ✅ Available everywhere<br/>
                    ✅ Non-intrusive design<br/>
                    ✅ Updates immediately
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>

          {hasUnsavedChanges && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-amber-600">⚠️</span>
                <span className="text-sm font-medium text-amber-800">Unsaved Changes</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                You have unsaved changes. Click "Save Settings" to apply them.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>ℹ️</span>
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Current Webhook URLs</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Chat Webhook:</span>
                  <div className="text-xs font-mono text-gray-600 break-all">
                    {webhookUrls.chatWebhookUrl || 'Not configured'}
                  </div>
                </div>
                <div>
                  <span className="font-medium">CSV Upload Webhook:</span>
                  <div className="text-xs font-mono text-gray-600 break-all">
                    {webhookUrls.csvUploadWebhookUrl || 'Not configured'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Limits & Validation</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Max Contacts:</span> 50 per campaign
                </div>
                <div>
                  <span className="font-medium">Name Length:</span> 2-64 characters
                </div>
                <div>
                  <span className="font-medium">Phone Format:</span> E.164 (+1234567890)
                </div>
                <div>
                  <span className="font-medium">Status Types:</span> NEW, CALLING, DONE, FAILED
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Contact Information */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📧</span>
            <span>Support & Contact</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Application Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">App Name:</span> {branding.appName}
                </div>
                <div>
                  <span className="font-medium">Company:</span> {branding.companyName}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {branding.appDescription}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Support Contact</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Support Email:</span> 
                  <a 
                    href={`mailto:${branding.supportEmail}`}
                    className="text-brand-primary hover:text-brand-secondary ml-1 underline"
                  >
                    {branding.supportEmail}
                  </a>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Need help? Contact our support team for assistance with campaigns, 
                  technical issues, or general questions.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetSettings}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          Reset Chat Settings
        </Button>
        
        <div className="space-x-4">
          <Button 
            variant="outline"
            onClick={() => {
              setChatMode(localStorage.getItem('chatMode') || 'inline');
              setHasUnsavedChanges(false);
            }}
            disabled={!hasUnsavedChanges}
          >
            Cancel
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={!hasUnsavedChanges}
            className="bg-brand-primary hover:bg-brand-secondary"
          >
            Save Chat Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
