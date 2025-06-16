
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-brand-primary hover:bg-brand-secondary shadow-lg"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
        </Button>
      ) : (
        <Card className="w-96 h-[600px] shadow-xl">
          <CardHeader className="pb-3 bg-brand-primary text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">AutoLynx Assistant</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-white hover:bg-white/20"
              >
                <X size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-[450px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800 mr-4'
                      : 'bg-brand-primary text-white ml-4'
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {isLoading && (
                <div className="bg-gray-100 text-gray-800 mr-4 p-3 rounded-lg text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex gap-3 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or paste contacts..."
                className="resize-none text-sm min-h-[60px] flex-1"
                rows={3}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="lg"
                className="bg-brand-primary hover:bg-brand-secondary h-[60px] px-4"
              >
                <Send size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;
