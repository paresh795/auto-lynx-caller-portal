
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [chatMode, setChatMode] = useState('inline');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedChatMode = localStorage.getItem('chatMode') || 'inline';
    setChatMode(savedChatMode);
  }, []);

  const handleChatModeChange = (value: string) => {
    setChatMode(value);
    setHasUnsavedChanges(true);
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure your AutoLynx preferences and chat options.
        </p>
      </div>

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
              <h4 className="font-medium text-gray-900 mb-3">API Endpoints</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Chat Trigger:</span>
                  <div className="text-xs font-mono text-gray-600 break-all">
                    https://pranaut.app.n8n.cloud/webhook/6e26988b-5633-4b04-995a-35902aa8ca1e/chat
                  </div>
                </div>
                <div>
                  <span className="font-medium">CSV Upload:</span>
                  <div className="text-xs font-mono text-gray-600 break-all">
                    https://pranaut.app.n8n.cloud/webhook/999f6676-738f-478a-95ec-246b01d71e24
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

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetSettings}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          Reset to Defaults
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
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
