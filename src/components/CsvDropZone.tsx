
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CsvDropZoneProps {
  onUpload: (data: any[]) => void;
  isLoading: boolean;
}

const CsvDropZone = ({ onUpload, isLoading }: CsvDropZoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const validateContact = (contact: any) => {
    const errors = [];
    
    if (!contact.name || contact.name.length < 2 || contact.name.length > 64) {
      errors.push('Name must be 2-64 characters');
    }
    
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!contact.phone || !phoneRegex.test(contact.phone)) {
      errors.push('Phone must be in E.164 format (+1234567890)');
    }
    
    return errors;
  };

  const parseCsvData = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const contacts = [];
    for (let i = 1; i < lines.length && i <= 50; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const contact: any = {};
      
      headers.forEach((header, index) => {
        contact[header] = values[index] || '';
      });
      
      const errors = validateContact(contact);
      if (errors.length === 0) {
        contacts.push(contact);
      }
    }
    
    return contacts;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          const contacts = parseCsvData(text);
          onUpload(contacts);
        } catch (error) {
          console.error('CSV parsing error:', error);
        }
      };
      reader.readAsText(file);
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
