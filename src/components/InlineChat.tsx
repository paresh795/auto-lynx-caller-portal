import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWebhookConfig } from '@/hooks/useWebhookConfig';
import { generateUUID } from '@/lib/utils';

interface InlineChatProps {
  onSubmit?: (contacts: any[]) => void;
}

const InlineChat = ({ onSubmit }: InlineChatProps) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, text: string, isBot: boolean}>>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    // Try to get existing session from localStorage, or create new one
    const existingSession = localStorage.getItem('inlineChat_sessionId');
    if (existingSession) {
      console.log('🔄 Resuming existing session:', existingSession);
      return existingSession;
    } else {
      const newSession = generateUUID();
      localStorage.setItem('inlineChat_sessionId', newSession);
      console.log('🆕 Created new session:', newSession);
      return newSession;
    }
  });
  const { toast } = useToast();
  const { config } = useWebhookConfig();

  // Expert-level message persistence functions
  const saveMessagesToStorage = (messages: Array<{id: string, text: string, isBot: boolean}>) => {
    try {
      // Limit to last 50 messages to prevent storage bloat
      const limitedMessages = messages.slice(-50);
      const storageKey = `inlineChat_messages_${sessionId}`;
      localStorage.setItem(storageKey, JSON.stringify(limitedMessages));
      console.log('💾 Messages saved to storage:', limitedMessages.length);
    } catch (error) {
      console.warn('⚠️ Failed to save messages to storage:', error);
      // Graceful degradation - app continues working without persistence
    }
  };

  const loadMessagesFromStorage = (): Array<{id: string, text: string, isBot: boolean}> => {
    try {
      const storageKey = `inlineChat_messages_${sessionId}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        console.log('📥 Messages loaded from storage:', parsed.length);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.warn('⚠️ Failed to load messages from storage:', error);
    }
    return [];
  };

  const cleanupOldSessions = () => {
    try {
      // Clean up old chat sessions (keep only current)
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('inlineChat_messages_') && !key.includes(sessionId)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      if (keysToRemove.length > 0) {
        console.log('🧹 Cleaned up old chat sessions:', keysToRemove.length);
      }
    } catch (error) {
      console.warn('⚠️ Failed to cleanup old sessions:', error);
    }
  };

  // Load messages on component mount and handle greeting
  useEffect(() => {
    const savedMessages = loadMessagesFromStorage();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
      setHasGreeted(true);
      console.log('🔄 Chat history restored with', savedMessages.length, 'messages');
    } else {
      // Only show greeting if no saved messages
      const greetingMessage = {
        id: generateUUID(),
        text: "Ready to help! Paste contacts like 'John Doe, +1234567890, Acme Corp' or type 'help' for formatting tips.",
        isBot: true
      };
      setMessages([greetingMessage]);
      setHasGreeted(true);
      console.log('👋 Showing initial greeting');
    }
    cleanupOldSessions();
  }, [sessionId]);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages, sessionId]);

  const resetSession = () => {
    const newSession = generateUUID();
    
    // Clear current session messages from storage
    try {
      const currentStorageKey = `inlineChat_messages_${sessionId}`;
      localStorage.removeItem(currentStorageKey);
    } catch (error) {
      console.warn('⚠️ Failed to clear old session storage:', error);
    }
    
    setSessionId(newSession);
    localStorage.setItem('inlineChat_sessionId', newSession);
    setMessages([]);
    setHasGreeted(false);
    console.log('🔄 Session reset. New session:', newSession);
    toast({
      title: "Session Reset",
      description: "Chat history cleared. Starting fresh conversation.",
    });
  };

  const parseTextToContacts = (text: string) => {
    const lines = text.trim().split('\n');
    const contacts = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Try to parse different formats
      // Format 1: "John Doe, +1234567890, Company Name"
      // Format 2: "John Doe +1234567890"
      // Format 3: "+1234567890 John Doe"
      
      const parts = trimmed.split(',').map(p => p.trim());
      let name = '';
      let phone = '';
      let business_name = '';
      
      if (parts.length >= 2) {
        // CSV-like format
        name = parts[0];
        phone = parts[1];
        business_name = parts[2] || '';
      } else {
        // Single line format - look for phone number pattern
        const phoneMatch = trimmed.match(/\+?[1-9]\d{1,14}/);
        if (phoneMatch) {
          phone = phoneMatch[0];
          // Add + if not present
          if (!phone.startsWith('+')) {
            phone = '+' + phone;
          }
          name = trimmed.replace(phoneMatch[0], '').trim();
        }
      }
      
      // Clean up phone number
      if (phone && !phone.startsWith('+')) {
        phone = '+' + phone;
      }
      
      // Validate
      if (name && phone && name.length >= 2 && name.length <= 64) {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (phoneRegex.test(phone)) {
          contacts.push({ name, phone, business_name });
        }
      }
    }
    
    return contacts.slice(0, 50); // Limit to 50 contacts
  };

  const handleSubmit = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsLoading(true);

    // Add user message to chat
    const userMsg = {
      id: generateUUID(),
      text: userMessage,
      isBot: false
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      console.log('Sending inline chat to:', config.chatWebhookUrl);
      console.log('Request payload:', { chatInput: userMessage, sessionId });
      
      // Use a reasonable timeout for initial response only
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout
      
      const response = await fetch(config.chatWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: userMessage,
          sessionId
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Inline chat response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('🔍 RAW N8N RESPONSE (InlineChat):', JSON.stringify(result, null, 2));
      
      // Enhanced response extraction
      let responseMessage = '';
      let campaignId = null;
      
      // Handle both object and array responses from n8n
      let dataToProcess = result;
      
      // If result is an array, get the first item
      if (Array.isArray(result) && result.length > 0) {
        dataToProcess = result[0];
        console.log('📦 Response is array, using first item:', dataToProcess);
      }
      
      if (dataToProcess.output) {
        responseMessage = dataToProcess.output;
        console.log('✅ Using dataToProcess.output');
      } else if (dataToProcess.response) {
        responseMessage = dataToProcess.response;
        console.log('✅ Using dataToProcess.response');
      } else if (dataToProcess.message) {
        responseMessage = dataToProcess.message;
        console.log('✅ Using dataToProcess.message');
      } else if (dataToProcess.text) {
        responseMessage = dataToProcess.text;
        console.log('✅ Using dataToProcess.text');
      } else if (typeof dataToProcess === 'string') {
        responseMessage = dataToProcess;
        console.log('✅ Using string response');
      } else {
        console.log('❌ No response found, using fallback');
        responseMessage = 'I received your message and processed it successfully.';
      }

      // Extract campaign ID if present
      const campaignMatch = responseMessage.match(/ALX-(\d+)/);
      if (campaignMatch) {
        campaignId = campaignMatch[0];
      }

      const botMessage = {
        id: generateUUID(),
        text: responseMessage,
        isBot: true
      };
      setMessages(prev => [...prev, botMessage]);

      // Only call onSubmit if there are actual contacts parsed (not for chat responses)
      if (onSubmit && validContacts.length > 0) {
        onSubmit(validContacts);
      }

    } catch (error: any) {
      console.log('Chat submission error:', error);
      
      let errorMessage = '';
      
      if (error.name === 'AbortError') {
        errorMessage = `🚀 Campaign queued successfully! 
        
⏱️ Processing takes 5-20 minutes in the background.

📊 Check your Dashboard for real-time progress updates.

💬 Feel free to start another conversation or upload more contacts!`;
      } else if (error.message?.includes('CORS')) {
        errorMessage = "🌐 Network connectivity issue detected. Your request may still be processing. Try refreshing the page and check your dashboard.";
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = "📡 Connection issue - your request might still be processing in the background. Check your dashboard for campaign updates.";
      } else {
        errorMessage = `❌ ${error.message || 'An unexpected error occurred. Please try again.'}`;
      }

      const errorMsg = {
        id: generateUUID(),
        text: errorMessage,
        isBot: true
      };
      setMessages(prev => [...prev, errorMsg]);

      toast({
        title: "Request Status",
        description: "If you were creating a campaign, check your dashboard - it may have succeeded despite the error.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validContacts = parseTextToContacts(chatInput);

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Chat Header - Compact but Professional */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            AI Assistant Chat
          </h3>
          <p className="text-xs text-gray-500">Session: {sessionId.slice(0, 8)}...</p>
        </div>
        <Button
          onClick={resetSession}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-xs px-3 py-1.5 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>

      {/* Chat Messages - Takes up maximum space but leaves room for input */}
      <div className="flex-1 overflow-y-auto space-y-4 p-5 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`p-4 rounded-xl max-w-[85%] ${
              message.isBot 
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 border border-blue-200 shadow-md' 
                : 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-900 border border-purple-200 shadow-md'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 border border-blue-200 p-4 rounded-xl shadow-md">
              <p className="text-sm flex items-center">
                <span className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></span>
                AI is thinking...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom with proper spacing */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="space-y-3">
          <Textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Enter contact information or ask questions..."
            className="w-full resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-lg shadow-sm"
            rows={4}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 flex items-center">
              <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
              Press Enter to send • Shift+Enter for new line
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !chatInput.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
              {isLoading ? 'Processing...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineChat;
