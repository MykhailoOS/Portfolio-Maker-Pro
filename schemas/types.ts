export type FieldType = 'text' | 'textarea' | 'image' | 'select' | 'switch' | 'chips';

export interface FieldDef {
  key: string;
  type: FieldType;
  label: string;
  required?: boolean;
  help?: string;
  options?: Array<{ value: string; label: string }>; // For select
  placeholder?: string;
}

export interface SectionSchema {
  type: string;
  fields: FieldDef[];
}

export interface ImageValue {
  id: string;
  url: string;
  alt?: string;
}
