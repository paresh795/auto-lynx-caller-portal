
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface CsvDropZoneProps {
  onUpload: (message: string) => void;
  isLoading: boolean;
}

const CsvDropZone = ({ onUpload, isLoading }: CsvDropZoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    console.log('Starting CSV upload for file:', file.name);
    setUploadStatus('uploading');
    setStatusMessage('Uploading your CSV file...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Sending request to webhook...');
      
      const response = await fetch('https://pranaut.app.n8n.cloud/webhook/c6e5eaf2-663d-4f44-a047-c60e3fb1aceb', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      });

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
        const successMessage = result.message || `CSV uploaded successfully! Campaign has been started with ${file.name}.`;
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
      
      let errorMessage = 'Error uploading CSV file. ';
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage += 'Unable to connect to the server. Please check your internet connection or try again later.';
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      setUploadStatus('error');
      setStatusMessage(errorMessage);
      onUpload(errorMessage);
      
      // Clear error status after 8 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setStatusMessage('');
      }, 8000);
    }
  }, [onUpload]);

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
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          getStatusColor(),
          uploadStatus === 'uploading' && 'cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="text-4xl">
            {getStatusIcon()}
          </div>
          
          {uploadStatus === 'uploading' ? (
            <div>
              <p className="text-lg font-medium text-blue-600">Uploading...</p>
              <p className="text-sm text-gray-600">Please wait while we process your file</p>
            </div>
          ) : uploadStatus === 'success' ? (
            <div>
              <p className="text-lg font-medium text-green-600">Upload Successful!</p>
              <p className="text-sm text-gray-600">Your campaign has been started</p>
            </div>
          ) : uploadStatus === 'error' ? (
            <div>
              <p className="text-lg font-medium text-red-600">Upload Failed</p>
              <p className="text-sm text-gray-600">Please try again</p>
            </div>
          ) : isDragActive ? (
            <div>
              <p className="text-lg font-medium text-brand-primary">Drop your CSV file here</p>
              <p className="text-sm text-gray-600">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drag & drop your CSV file here
              </p>
              <p className="text-sm text-gray-600">
                or click to browse files
              </p>
            </div>
          )}
          
          <Button 
            type="button" 
            variant="outline" 
            disabled={uploadStatus === 'uploading'}
            className="mt-4"
          >
            {uploadStatus === 'uploading' ? 'Processing...' : 'Choose File'}
          </Button>
        </div>
      </div>
      
      {statusMessage && (
        <Alert variant={uploadStatus === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>
            {statusMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CsvDropZone;
