import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn, getBranding } from '@/lib/utils';
import ChatWidget from './ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [chatMode, setChatMode] = useState('inline');
  const branding = getBranding();

  useEffect(() => {
    const savedChatMode = localStorage.getItem('chatMode') || 'inline';
    setChatMode(savedChatMode);
  }, []);

  // Listen for storage changes to update chat mode in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const savedChatMode = localStorage.getItem('chatMode') || 'inline';
      setChatMode(savedChatMode);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    window.addEventListener('chatModeChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('chatModeChanged', handleStorageChange);
    };
  }, []);

  const navigation = [
    { name: 'Upload', href: '/upload', icon: '📤' },
    { name: 'Campaigns', href: '/campaigns', icon: '📊' },
    { name: 'Dashboard', href: '/dashboard', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  // Generate initials from company name for logo
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{getInitials(branding.companyName)}</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{branding.companyName}</span>
              </Link>
            </div>
            
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'bg-brand-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Conditional Chat Widget */}
      {chatMode === 'widget' && <ChatWidget />}
    </div>
  );
};

export default Layout;
