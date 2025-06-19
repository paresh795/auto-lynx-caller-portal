import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// UUID generation utility that works across all browsers
export function generateUUID(): string {
  // Try crypto.randomUUID first (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback to manual UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Branding utilities - Get customizable app information from environment variables
export const getBranding = () => {
  return {
    appName: import.meta.env.VITE_APP_NAME || 'AutoLynx AI Caller Portal',
    companyName: import.meta.env.VITE_COMPANY_NAME || 'AutoLynx',
    appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Professional AI-Powered Cold Calling Campaign Management',
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@autolynx.ai'
  };
};

// Update document title dynamically
export const updateDocumentTitle = (pageTitle?: string) => {
  const branding = getBranding();
  document.title = pageTitle 
    ? `${pageTitle} - ${branding.appName}` 
    : branding.appName;
};

// Update document meta description
export const updateDocumentMeta = () => {
  const branding = getBranding();
  
  // Update description
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', branding.appDescription);
  }
  
  // Update Open Graph title
  const ogTitleMeta = document.querySelector('meta[property="og:title"]');
  if (ogTitleMeta) {
    ogTitleMeta.setAttribute('content', branding.appName);
  }
  
  // Update Open Graph description
  const ogDescMeta = document.querySelector('meta[property="og:description"]');
  if (ogDescMeta) {
    ogDescMeta.setAttribute('content', branding.appDescription);
  }
  
  // Update Twitter title
  const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitleMeta) {
    twitterTitleMeta.setAttribute('content', branding.appName);
  }
  
  // Update Twitter description
  const twitterDescMeta = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescMeta) {
    twitterDescMeta.setAttribute('content', branding.appDescription);
  }
};
