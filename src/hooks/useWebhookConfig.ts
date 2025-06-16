
import { useState, useEffect } from 'react';

interface WebhookConfig {
  chatWebhookUrl: string;
  csvUploadWebhookUrl: string;
}

const DEFAULT_CONFIG: WebhookConfig = {
  chatWebhookUrl: '',
  csvUploadWebhookUrl: ''
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
          setConfig(parsedConfig);
        }
      } catch (error) {
        console.error('Failed to load webhook config:', error);
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
    resetConfig
  };
};
