import React from 'react';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import type { FieldDef } from '../../../schemas/types';

interface SwitchFieldProps {
  field: FieldDef;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({ field, value, onChange }) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor={field.key} className="flex-1">
        {field.label}
        {field.help && <span className="block text-xs text-muted-foreground font-normal mt-0.5">{field.help}</span>}
      </Label>
      <Switch
        id={field.key}
        checked={value || false}
        onCheckedChange={onChange}
      />
    </div>
  );
};
