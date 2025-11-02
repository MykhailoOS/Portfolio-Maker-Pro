

import React from 'react';
import type { Section, Locale, LocalizedString } from '../types';
import { X } from 'lucide-react';

const LocalizedInput: React.FC<{
  label: string;
  value: LocalizedString;
  field: string;
  activeLocale: Locale;
  onChange: (field: string, newValue: LocalizedString) => void;
}> = ({ label, value, field, activeLocale, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field, { ...value, [activeLocale]: e.target.value });
  };

  const isTextarea = (value[activeLocale]?.length || 0) > 60;
  const commonProps = {
    id: field,
    value: value?.[activeLocale] || '',
    onChange: handleChange,
    className: "w-full p-2 bg-brand-night border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
  };

  return (
    <div className="mb-4">
      <label htmlFor={field} className="block text-sm font-medium text-brand-mist mb-1">{label}</label>
      {isTextarea ? <textarea {...commonProps} rows={4} /> : <input type="text" {...commonProps} />}
    </div>
  );
};


export const Inspector: React.FC<{
  section: Section | undefined;
  onUpdate: (sectionId: string, data: any) => void;
  activeLocale: Locale;
  onClose: () => void;
}> = ({ section, onUpdate, activeLocale, onClose }) => {
  if (!section) {
    return (
      <div className="w-full h-full bg-brand-dark p-4 flex flex-col text-brand-mist">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold">Inspector</h2>
            <button onClick={onClose} className="md:hidden text-brand-mist hover:text-white"><X size={24} /></button>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <p>Select a section to edit its properties.</p>
          </div>
      </div>
    );
  }

  const handleDataChange = (field: string, newValue: any) => {
    onUpdate(section.id, { ...section.data, [field]: newValue });
  };
  
  const handleLocalizedChange = (field: string, newValue: LocalizedString) => {
    onUpdate(section.id, { ...section.data, [field]: newValue });
  };
  
  const renderFields = () => {
    return Object.keys(section.data).map(key => {
        const value = section.data[key];
        if (typeof value === 'object' && value !== null && 'en' in value) {
            return (
                <LocalizedInput 
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    field={key}
                    value={value}
                    activeLocale={activeLocale}
                    onChange={handleLocalizedChange}
                />
            )
        }
        // Add more complex field types here (e.g., for skills, projects array)
        return null;
    })
  }

  return (
    <div className="w-full h-full bg-brand-dark md:border-l md:border-gray-700 p-4 flex flex-col overflow-y-auto">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold">{section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section</h2>
        <button onClick={onClose} className="md:hidden text-brand-mist hover:text-white"><X size={24} /></button>
      </div>
      <div className="flex-grow">
        {renderFields()}
      </div>
    </div>
  );
};