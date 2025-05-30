
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface InlineChatProps {
  onSubmit: (data: any[]) => void;
  isLoading: boolean;
}

const InlineChat = ({ onSubmit, isLoading }: InlineChatProps) => {
  const [chatInput, setChatInput] = useState('');

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
        // Single line format
        const phoneMatch = trimmed.match(/\+[1-9]\d{1,14}/);
        if (phoneMatch) {
          phone = phoneMatch[0];
          name = trimmed.replace(phone, '').trim();
        }
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
    
    try {
      const contacts = parseTextToContacts(chatInput);
      if (contacts.length === 0) {
        throw new Error('No valid contacts found. Please check the format.');
      }
      
      // Submit via chat endpoint
      const response = await fetch('https://pranaut.app.n8n.cloud/webhook/6e26988b-5633-4b04-995a-35902aa8ca1e/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: chatInput.trim(),
          sessionId: crypto.randomUUID()
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        onSubmit(contacts);
        setChatInput('');
      } else {
        throw new Error(result.message || 'Failed to process contacts');
      }
    } catch (error) {
      console.error('Chat submission error:', error);
      // Still try to parse and submit locally
      const contacts = parseTextToContacts(chatInput);
      if (contacts.length > 0) {
        onSubmit(contacts);
        setChatInput('');
      }
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your contacts here... Examples:
John Doe, +1234567890, Acme Corp
Jane Smith, +1987654321
+1555123456 Bob Johnson"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        className="min-h-[200px] resize-none"
        disabled={isLoading}
      />
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {chatInput.trim() ? `${parseTextToContacts(chatInput).length} valid contacts found` : 'Supports multiple formats'}
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
