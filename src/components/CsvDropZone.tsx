
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CsvDropZoneProps {
  onUpload: (message: string) => void;
  isLoading: boolean;
}

const CsvDropZone = ({ onUpload, isLoading }: CsvDropZoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      // Send file directly to webhook without preprocessing
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('https://pranaut.app.n8n.cloud/webhook/c6e5eaf2-663d-4f44-a047-c60e3fb1aceb', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (response.ok) {
        onUpload(result.message || 'CSV uploaded successfully. Campaign has been started.');
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('CSV upload error:', error);
      onUpload('Error uploading CSV file. Please try again.');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive || dragActive
          ? 'border-brand-primary bg-brand-primary/5'
          : 'border-gray-300 hover:border-gray-400'
      )}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="text-4xl">
          {isDragActive ? '⬇️' : '📁'}
        </div>
        
        {isDragActive ? (
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
          disabled={isLoading}
          className="mt-4"
        >
          {isLoading ? 'Processing...' : 'Choose File'}
        </Button>
      </div>
    </div>
  );
};

export default CsvDropZone;
