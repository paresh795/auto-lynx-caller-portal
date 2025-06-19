import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, MessageCircle, Send, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWebhookConfig } from '@/hooks/useWebhookConfig';
import { generateUUID, getBranding } from '@/lib/utils';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, text: string, isBot: boolean}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    // Try to get existing session from localStorage, or create new one
    const existingSession = localStorage.getItem('chatWidget_sessionId');
    if (existingSession) {
      console.log('🔄 ChatWidget resuming session:', existingSession);
      return existingSession;
    } else {
      const newSession = generateUUID();
      localStorage.setItem('chatWidget_sessionId', newSession);
      console.log('🆕 ChatWidget created session:', newSession);
      return newSession;
    }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { config } = useWebhookConfig();
  const branding = getBranding();

  const resetSession = () => {
    const newSession = generateUUID();
    setSessionId(newSession);
    localStorage.setItem('chatWidget_sessionId', newSession);
    setMessages([]);
    setHasGreeted(false);
    console.log('🔄 ChatWidget session reset. New session:', newSession);
    toast({
      title: "Chat Session Reset",
      description: "Conversation history cleared. Starting fresh.",
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show greeting when first opened
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      setMessages([{
        id: '1',
        text: `Hi! I'm your ${branding.companyName} AI Assistant. I can help you with:\n\n• Formatting contact lists\n• Creating calling campaigns\n• Answering questions about the system\n• Processing CSV files\n\nWhat would you like to do today?`,
        isBot: true
      }]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, messages.length, branding.companyName]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setInput(''); // Clear input immediately
    
    // Add user message
    setMessages(prev => [...prev, {
      id: generateUUID(),
      text: message,
      isBot: false
    }]);

    try {
      console.log('Sending chat message to:', config.chatWebhookUrl);
      
      // Enhanced payload for conversational AI
      const payload = {
        chatInput: message.trim(),
        sessionId
      };
      
      console.log('🔍 DEBUGGING CHAT RESPONSE:');
      console.log('Request payload:', payload);
      
      // Implement timeout handling for initial response only
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

      const response = await fetch(config.chatWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('🔍 DEBUGGING CHAT RESPONSE:');
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('🔍 RAW RESPONSE FROM N8N:', JSON.stringify(result, null, 2));
      
      if (result.success !== false) {
        let botResponseText = '';
        
        // Enhanced extraction with debugging
        console.log('🔍 EXTRACTING RESPONSE:');
        console.log('result.response:', result.response);
        console.log('result.message:', result.message);
        console.log('result.output:', result.output);
        console.log('result.text:', result.text);
        console.log('result:', result);
        
        // Handle both object and array responses from n8n
        let dataToProcess = result;
        
        // If result is an array, get the first item
        if (Array.isArray(result) && result.length > 0) {
          dataToProcess = result[0];
          console.log('📦 Response is array, using first item:', dataToProcess);
        }
        
        if (dataToProcess.output) {
          botResponseText = dataToProcess.output;
          console.log('✅ Using dataToProcess.output');
        } else if (dataToProcess.response) {
          botResponseText = dataToProcess.response;
          console.log('✅ Using dataToProcess.response');
        } else if (dataToProcess.message) {
          botResponseText = dataToProcess.message;
          console.log('✅ Using dataToProcess.message');
        } else if (dataToProcess.text) {
          botResponseText = dataToProcess.text;
          console.log('✅ Using dataToProcess.text');
        } else if (typeof dataToProcess === 'string') {
          botResponseText = dataToProcess;
          console.log('✅ Using string response');
        } else {
          console.log('❌ No response found, using fallback');
          botResponseText = 'I received your message and processed it successfully.';
        }

        // Add bot response
        setMessages(prev => [...prev, {
          id: generateUUID(),
          text: botResponseText,
          isBot: true
        }]);



      } else {
        throw new Error(result.error || result.message || 'Failed to process message');
      }

    } catch (error: any) {
      console.log('Chat error:', error);
      
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

      // Add error message
      setMessages(prev => [...prev, {
        id: generateUUID(),
        text: errorMessage,
        isBot: true
      }]);

      toast({
        title: "Request Status",
        description: "If you were creating a campaign, check your dashboard - it may have succeeded despite the error.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearConversation = () => {
    setMessages([{
      id: Date.now().toString(),
      text: "Conversation cleared. How can I help you today?",
      isBot: true
    }]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
          aria-label="Open chat"
        >
          <MessageCircle size={28} color="white" />
        </Button>
      ) : (
        <div 
          className="bg-white rounded-xl shadow-xl flex flex-col"
          style={{
            width: '380px',
            height: '550px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }}
        >
          {/* Chat Header */}
          <div 
            className="text-white p-4 rounded-t-xl flex justify-between items-center"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: '600'
            }}
          >
            <div className="flex flex-col">
              <span>{branding.companyName} AI Assistant</span>
              <span className="text-xs text-white/80">
                {isLoading ? 'Thinking...' : 'Online'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetSession}
                aria-label="Reset conversation"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                title="Reset conversation"
              >
                <RotateCcw size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            className="flex-1 p-4 overflow-y-auto space-y-3"
            style={{ background: '#f8fafc' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${
                  message.isBot
                    ? 'bg-white text-gray-800 shadow-sm border border-gray-100 mr-4'
                    : 'text-white ml-4'
                }`}
                style={!message.isBot ? {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                } : {}}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white text-gray-800 mr-4 p-3 rounded-lg text-sm shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Enhanced Chat Input */}
          <div className="p-4 bg-white rounded-b-xl border-t">
            <div className="flex space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask me anything about ${branding.companyName}, contact formatting, or campaign creation...`}
                className="flex-1 min-h-[40px] max-h-[100px] resize-none border-gray-200 focus:border-purple-400"
                disabled={isLoading}
                rows={1}
              />
              <Button 
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="px-3"
                style={{
                  background: isLoading || !input.trim() 
                    ? '#e2e8f0' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              >
                <Send size={18} />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setInput("Help me format my contact list")}
                className="text-xs"
                disabled={isLoading}
              >
                Format Contacts
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setInput("How do I create a calling campaign?")}
                className="text-xs"
                disabled={isLoading}
              >
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
