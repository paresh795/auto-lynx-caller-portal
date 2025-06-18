import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useWebhookConfig } from '@/hooks/useWebhookConfig';
import { Upload } from 'lucide-react';

interface CsvDropZoneProps {
  onUpload: (message: string) => void;
  isLoading: boolean;
}

const CsvDropZone = ({ onUpload, isLoading }: CsvDropZoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const { config, isConfigured } = useWebhookConfig();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check if webhook URL is configured
    if (!isConfigured) {
      const errorMessage = 'Webhook URLs not configured. Please configure them in Settings.';
      setUploadStatus('error');
      setStatusMessage(errorMessage);
      onUpload(errorMessage);
      
      setTimeout(() => {
        setUploadStatus('idle');
        setStatusMessage('');
      }, 8000);
      return;
    }

    console.log('Starting CSV upload for file:', file.name);
    console.log('Using webhook URL:', config.csvUploadWebhookUrl);
    
    setUploadStatus('uploading');
    setStatusMessage('Processing your CSV file and starting campaign...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Sending request to configured webhook...');
      
      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 120000); // 2 minute timeout for initial response
      
      const response = await fetch(config.csvUploadWebhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Webhook response status:', response.status);
      console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = { message: await response.text() };
      }
      
      console.log('Webhook response data:', result);

      if (response.ok) {
        const successMessage = result.message || result || `CSV uploaded successfully! Campaign processing has started with ${file.name}. Monitor campaign progress in the Dashboard.`;
        setUploadStatus('success');
        setStatusMessage(successMessage);
        onUpload(successMessage);
        
        // Clear success status after 5 seconds
        setTimeout(() => {
          setUploadStatus('idle');
          setStatusMessage('');
        }, 5000);
      } else {
        throw new Error(result.message || `Upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('CSV upload error:', error);
      
      let errorMessage = 'Error processing CSV file. ';
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage += 'Request timed out. The campaign may still be processing. Check your Dashboard for status updates.';
        setUploadStatus('success'); // Set as success since it might still be processing
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage += 'Unable to connect to the webhook server. Please check your webhook URL configuration in Settings and your internet connection.';
        setUploadStatus('error');
      } else if (error instanceof Error) {
        errorMessage += error.message;
        setUploadStatus('error');
      } else {
        errorMessage += 'Please try again.';
        setUploadStatus('error');
      }
      
      setStatusMessage(errorMessage);
      onUpload(errorMessage);
      
      // Clear status after 10 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setStatusMessage('');
      }, 10000);
    }
  }, [onUpload, config.csvUploadWebhookUrl, isConfigured]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: uploadStatus === 'uploading',
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'uploading': return 'border-blue-500 bg-blue-50';
      case 'success': return 'border-green-500 bg-green-50';
      case 'error': return 'border-red-500 bg-red-50';
      default: return isDragActive || dragActive ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-300 hover:border-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return isDragActive ? '⬇️' : '📁';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div
        {...getRootProps()}
        className={`
          flex-1 flex flex-col items-center justify-center
          border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
          min-h-[320px] p-8
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]' 
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
          }
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-blue-600">Processing CSV...</p>
              <p className="text-sm text-gray-600">Please wait while we validate your contacts</p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">
                {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
                {isDragActive 
                  ? 'Release to upload your contact list'
                  : 'Upload your contact list to start a new calling campaign'
                }
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <Button
                type="button"
                variant="outline"
                className="px-8 py-3 text-base font-medium bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 transition-all shadow-sm"
                disabled={isLoading}
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose File
              </Button>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  CSV files only
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Max 50 contacts
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Display */}
      {statusMessage && (
        <Alert className={cn(
          uploadStatus === 'error' ? 'border-red-500 bg-red-50' : 
          uploadStatus === 'success' ? 'border-green-500 bg-green-50' : 
          'border-blue-500 bg-blue-50'
        )}>
          <AlertDescription className="text-sm">
            {statusMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Required CSV format information */}
      <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <p className="font-medium">Required CSV format:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <strong>name</strong> - Contact name (2-64 characters)
          </div>
          <div>
            <strong>phone</strong> - Phone number in E.164 format (+12345678901)
          </div>
          <div>
            <strong>business_name</strong> - Company name (optional)
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvDropZone;
