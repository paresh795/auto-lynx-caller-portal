
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, text: string, isBot: boolean}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show greeting when first opened
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setMessages([{
        id: '1',
        text: "Hi! I'm here to help you with your calling campaigns. You can paste contact lists, ask questions, or get help formatting your data. Try typing 'help' for more information!",
        isBot: true
      }]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('https://pranaut.app.n8n.cloud/webhook/2e9f09bc-7d53-4387-9d61-0fcb16a4d131', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: crypto.randomUUID(),
          contactsRaw: input.trim()
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.message) {
        const botMessage = { id: (Date.now() + 1).toString(), text: result.message, isBot: true };
        setMessages(prev => [...prev, botMessage]);
        
        // Show success toast if it looks like a campaign was created
        if (result.message.toLowerCase().includes('campaign') || result.message.toLowerCase().includes('queued')) {
          toast({
            title: "Campaign Started",
            description: "Your campaign has been queued successfully.",
          });
        }
      } else {
        throw new Error(result.message || 'Failed to process message');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        id: (Date.now() + 1).toString(), 
        text: "Sorry, I encountered an error. Please try again.", 
        isBot: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
            width: '350px',
            height: '500px',
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
            <span>AutoLynx Assistant</span>
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

          {/* Chat Messages */}
          <div 
            className="flex-1 p-5 overflow-y-auto space-y-3"
            style={{ background: '#f8fafc' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg text-sm ${
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
          
          {/* Chat Input Container */}
          <div 
            className="p-4 bg-white rounded-b-xl"
            style={{ borderTop: '1px solid #e2e8f0' }}
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your contacts here... Examples: John Doe, +1234567890, Acme Corp or ask me questions about formatting!"
              className="w-full resize-vertical border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg p-3 text-sm transition-all duration-200"
              style={{ 
                minHeight: '80px',
                fontFamily: 'inherit',
                lineHeight: '1.5'
              }}
              rows={3}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-full mt-3 py-3 text-white font-semibold rounded-lg transition-transform hover:scale-[1.02] disabled:hover:scale-100"
              style={{
                background: isLoading || !input.trim() 
                  ? '#94a3b8' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              <Send size={16} className="mr-2" />
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
