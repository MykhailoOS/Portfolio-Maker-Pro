export enum SectionType {
  Hero = 'hero',
  About = 'about',
  Skills = 'skills',
  Projects = 'projects',
  Contact = 'contact',
}

export type Locale = 'en' | 'ua' | 'ru' | 'pl';

export type DeviceView = 'desktop' | 'tablet' | 'mobile';

export interface LocalizedString {
  en: string;
  ua: string;
  ru: string;
  pl: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
}

export interface Project {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  link: string;
}

export interface Section<T = any> {
  id: string;
  type: SectionType;
  // Specific data for each section type
  data: T;
  // Visual effects configuration
  effects: {
    parallax: number; // 0-1, intensity
    blur: boolean;
    has3d: boolean;
  };
}

export type HeroSectionData = {
  headline: LocalizedString;
  subheadline: LocalizedString;
  ctaButton: LocalizedString;
};

export interface ImageValue {
  id: string;
  url: string;
  alt?: string;
}

export type AboutSectionData = {
  title: LocalizedString;
  paragraph: LocalizedString;
  avatar?: ImageValue;
  imageUrl?: string; // Keep for backward compatibility
  tags?: string[];
  layout?: 'left-image' | 'right-image' | 'stacked';
};

export type SkillsSectionData = {
  title: LocalizedString;
  skills: Skill[];
};

export type ProjectsSectionData = {
  title: LocalizedString;
  projects: Project[];
};

export type ContactSectionData = {
  title: LocalizedString;
  email: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
};

export type Portfolio = {
  id: string;
  name: string;
  sections: Section[];
  theme: {
    primaryColor: string;
    mode: 'dark' | 'light';
  };
  enabledLocales: Locale[];
  defaultLocale: Locale;
};