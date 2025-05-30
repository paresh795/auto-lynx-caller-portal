
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
      const response = await fetch('https://pranaut.app.n8n.cloud/webhook/6e26988b-5633-4b04-995a-35902aa8ca1e/chat', {
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
          className="rounded-full w-14 h-14 bg-brand-primary hover:bg-brand-secondary shadow-lg"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </Button>
      ) : (
        <Card className="w-80 h-96 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm">AutoLynx Assistant</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-3 space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-brand-primary text-white ml-8'
                  }`}
                >
                  {message.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or paste contacts..."
                className="resize-none text-sm"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="sm"
                className="bg-brand-primary hover:bg-brand-secondary"
              >
                <Send size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;
