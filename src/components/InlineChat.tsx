
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface InlineChatProps {
  onSubmit: (data: any[]) => void;
  isLoading: boolean;
}

const InlineChat = ({ onSubmit, isLoading }: InlineChatProps) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, text: string, isBot: boolean}>>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const { toast } = useToast();

  // Show greeting when component first mounts
  useEffect(() => {
    if (!hasGreeted) {
      setMessages([{
        id: '1',
        text: "Welcome! I can help you format and upload contact lists. You can paste contacts in various formats like 'John Doe, +1234567890, Acme Corp' or ask me questions about formatting. Try typing 'help' for more information!",
        isBot: true
      }]);
      setHasGreeted(true);
    }
  }, [hasGreeted]);

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
    if (!chatInput.trim()) return;
    
    const userMessage = { id: Date.now().toString(), text: chatInput, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Send to chat webhook
      const response = await fetch('https://pranaut.app.n8n.cloud/webhook/6e26988b-5633-4b04-995a-35902aa8ca1e/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: crypto.randomUUID(),
          contactsRaw: chatInput.trim()
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.message) {
        const botMessage = { id: (Date.now() + 1).toString(), text: result.message, isBot: true };
        setMessages(prev => [...prev, botMessage]);
        
        // Try to parse contacts for the callback
        const contacts = parseTextToContacts(chatInput);
        if (contacts.length > 0) {
          onSubmit(contacts);
          toast({
            title: "Campaign Started",
            description: result.message || "Your campaign has been queued successfully.",
          });
        }
        
        setChatInput('');
      } else {
        throw new Error(result.message || 'Failed to process contacts');
      }
    } catch (error) {
      console.error('Chat submission error:', error);
      const errorMessage = { 
        id: (Date.now() + 1).toString(), 
        text: "Sorry, I encountered an error processing your request. Please try again.", 
        isBot: true 
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to process contacts. Please check the format and try again.",
        variant: "destructive",
      });
    }
  };

  const validContacts = parseTextToContacts(chatInput);

  return (
    <div className="space-y-4">
      {/* Chat Messages */}
      <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-lg">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-lg text-sm ${
              message.isBot
                ? 'bg-white text-gray-800 border'
                : 'bg-brand-primary text-white ml-8'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <Textarea
        placeholder="Enter your contacts here... Examples:
John Doe, +1234567890, Acme Corp
Jane Smith, +1987654321
+1555123456 Bob Johnson

Or ask me questions about formatting!"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        className="min-h-[120px] resize-none"
        disabled={isLoading}
      />
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {chatInput.trim() ? `${validContacts.length} valid contacts found` : 'Supports multiple formats and questions'}
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={isLoading || !chatInput.trim()}
          className="bg-brand-primary hover:bg-brand-secondary"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
};

export default InlineChat;
