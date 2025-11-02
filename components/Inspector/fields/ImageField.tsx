import React, { useRef, useEffect } from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Upload, X } from 'lucide-react';
import type { FieldDef } from '../../../schemas/types';
import type { ImageValue } from '../../../types';

interface ImageFieldProps {
  field: FieldDef;
  value: ImageValue | null | undefined;
  onChange: (value: ImageValue | null) => void;
}

// Generate a simple UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const ImageField: React.FC<ImageFieldProps> = ({ field, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousUrlRef = useRef<string | null>(null);

  // Clean up old ObjectURL when value changes
  useEffect(() => {
    return () => {
      if (previousUrlRef.current && previousUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Revoke previous URL if it exists
    if (previousUrlRef.current && previousUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(previousUrlRef.current);
    }

    // Create new ObjectURL
    const url = URL.createObjectURL(file);
    previousUrlRef.current = url;

    onChange({
      id: generateUUID(),
      url,
      alt: value?.alt || '',
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAltChange = (alt: string) => {
    if (value) {
      onChange({ ...value, alt });
    }
  };

  const handleRemove = () => {
    if (value?.url && value.url.startsWith('blob:')) {
      URL.revokeObjectURL(value.url);
    }
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {value?.url ? (
        <div className="space-y-2">
          <div className="relative group">
            <img
              src={value.url}
              alt={value.alt || 'Preview'}
              className="w-full h-32 object-cover rounded-md border border-input"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
          <Input
            placeholder="Alt text (optional)"
            value={value.alt || ''}
            onChange={(e) => handleAltChange(e.target.value)}
          />
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
        </div>
      )}
      
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
};
