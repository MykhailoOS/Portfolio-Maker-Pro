import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import type { FieldDef } from '../../../schemas/types';

interface TextFieldProps {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={field.key}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={error ? 'border-red-500' : ''}
      />
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
