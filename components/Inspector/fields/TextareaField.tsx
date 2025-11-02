import React from 'react';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import type { FieldDef } from '../../../schemas/types';

interface TextareaFieldProps {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={field.key}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className={error ? 'border-red-500' : ''}
      />
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
