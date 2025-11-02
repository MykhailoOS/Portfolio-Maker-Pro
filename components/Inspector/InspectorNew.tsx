import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import type { Section, Locale, LocalizedString } from '../../types';
import type { SectionSchema } from '../../schemas/types';
import { TextField } from './fields/TextField';
import { TextareaField } from './fields/TextareaField';
import { SelectField } from './fields/SelectField';
import { SwitchField } from './fields/SwitchField';
import { ChipsField } from './fields/ChipsField';
import { ImageField } from './fields/ImageField';

interface InspectorNewProps {
  section: Section | undefined;
  schema: SectionSchema | null;
  onUpdate: (sectionId: string, data: any) => void;
  activeLocale: Locale;
  onClose: () => void;
}

export const InspectorNew: React.FC<InspectorNewProps> = ({
  section,
  schema,
  onUpdate,
  activeLocale,
  onClose,
}) => {
  // Validation errors
  const errors = useMemo(() => {
    if (!section || !schema) return {};
    const errs: Record<string, string> = {};
    
    schema.fields.forEach((field) => {
      if (field.required) {
        const value = section.data[field.key];
        if (field.type === 'text' || field.type === 'textarea') {
          const localizedValue = value as LocalizedString;
          if (!localizedValue?.[activeLocale]?.trim()) {
            errs[field.key] = 'This field is required';
          }
        } else if (!value) {
          errs[field.key] = 'This field is required';
        }
      }
    });
    
    return errs;
  }, [section, schema, activeLocale]);

  if (!section || !schema) {
    return (
      <div className="jsb-editor w-full h-full bg-brand-dark p-4 flex flex-col text-brand-mist">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold">Inspector</h2>
          <button onClick={onClose} className="md:hidden text-brand-mist hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <p>Select a section to edit its properties.</p>
        </div>
      </div>
    );
  }

  const handleFieldChange = (key: string, value: any, isLocalized: boolean = false) => {
    if (isLocalized) {
      // For localized fields, merge with existing localized values
      const currentValue = (section.data[key] as LocalizedString) || {
        en: '',
        ua: '',
        ru: '',
        pl: '',
      };
      onUpdate(section.id, {
        [key]: { ...currentValue, [activeLocale]: value },
      });
    } else {
      // For non-localized fields
      onUpdate(section.id, { [key]: value });
    }
  };

  const renderField = (field: any) => {
    const value = section.data[field.key];
    
    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={field.key}
            field={field}
            value={value?.[activeLocale] || ''}
            onChange={(val) => handleFieldChange(field.key, val, true)}
            error={errors[field.key]}
          />
        );
      
      case 'textarea':
        return (
          <TextareaField
            key={field.key}
            field={field}
            value={value?.[activeLocale] || ''}
            onChange={(val) => handleFieldChange(field.key, val, true)}
            error={errors[field.key]}
          />
        );
      
      case 'select':
        return (
          <SelectField
            key={field.key}
            field={field}
            value={value || field.options?.[0]?.value || ''}
            onChange={(val) => handleFieldChange(field.key, val, false)}
            error={errors[field.key]}
          />
        );
      
      case 'switch':
        return (
          <SwitchField
            key={field.key}
            field={field}
            value={value || false}
            onChange={(val) => handleFieldChange(field.key, val, false)}
          />
        );
      
      case 'chips':
        return (
          <ChipsField
            key={field.key}
            field={field}
            value={value || []}
            onChange={(val) => handleFieldChange(field.key, val, false)}
          />
        );
      
      case 'image':
        return (
          <ImageField
            key={field.key}
            field={field}
            value={value || null}
            onChange={(val) => handleFieldChange(field.key, val, false)}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="jsb-editor w-full h-full bg-brand-dark md:border-l md:border-gray-700 p-4 flex flex-col overflow-y-auto">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-white">
          {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
        </h2>
        <button onClick={onClose} className="md:hidden text-brand-mist hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-grow space-y-4">
        {schema.fields.map(renderField)}
      </div>
      
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-md">
          <p className="text-sm text-red-400">Please fill in all required fields</p>
        </div>
      )}
    </div>
  );
};
