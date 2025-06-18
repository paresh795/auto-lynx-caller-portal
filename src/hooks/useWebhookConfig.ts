import { useState, useEffect } from 'react';

interface WebhookConfig {
  chatWebhookUrl: string;
  csvUploadWebhookUrl: string;
}

// Default to environment variables (no hardcoded fallbacks for security)
const DEFAULT_CONFIG: WebhookConfig = {
  chatWebhookUrl: import.meta.env.VITE_CHAT_WEBHOOK_URL || '',
  csvUploadWebhookUrl: import.meta.env.VITE_CSV_UPLOAD_WEBHOOK_URL || ''
};

export const useWebhookConfig = () => {
  const [config, setConfig] = useState<WebhookConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem('webhookConfig');
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          // Merge with defaults to ensure all fields are present
          setConfig({
            ...DEFAULT_CONFIG,
            ...parsedConfig
          });
        } else {
          // If no saved config, use defaults
          setConfig(DEFAULT_CONFIG);
        }
      } catch (error) {
        console.error('Failed to load webhook config:', error);
        // Fallback to defaults
        setConfig(DEFAULT_CONFIG);
      } finally {
        setIsLoaded(true);
      }
    };

    loadConfig();
  }, []);

  const saveConfig = (newConfig: WebhookConfig) => {
    try {
      localStorage.setItem('webhookConfig', JSON.stringify(newConfig));
      setConfig(newConfig);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('webhookConfigChanged', { 
        detail: newConfig 
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to save webhook config:', error);
      return false;
    }
  };

  const resetConfig = () => {
    try {
      localStorage.removeItem('webhookConfig');
      setConfig(DEFAULT_CONFIG);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('webhookConfigChanged', { 
        detail: DEFAULT_CONFIG 
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to reset webhook config:', error);
      return false;
    }
  };

  return {
    config,
    isLoaded,
    saveConfig,
    resetConfig,
    isConfigured: Boolean(config.chatWebhookUrl && config.csvUploadWebhookUrl)
  };
};
