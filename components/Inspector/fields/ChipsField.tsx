import React, { useState } from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { X } from 'lucide-react';
import type { FieldDef } from '../../../schemas/types';

interface ChipsFieldProps {
  field: FieldDef;
  value: string[];
  onChange: (value: string[]) => void;
}

export const ChipsField: React.FC<ChipsFieldProps> = ({ field, value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={field.key}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={field.placeholder}
      />
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((chip, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-brand-accent/20 text-brand-accent rounded-md"
            >
              {chip}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="hover:text-white"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
