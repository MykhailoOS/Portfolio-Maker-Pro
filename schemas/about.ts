import type { SectionSchema } from './types';

export const aboutSchema: SectionSchema = {
  type: 'about',
  fields: [
    {
      key: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      placeholder: 'e.g. About Me',
    },
    {
      key: 'paragraph',
      type: 'textarea',
      label: 'Paragraph',
      required: true,
      placeholder: 'Tell your story...',
    },
    {
      key: 'avatar',
      type: 'image',
      label: 'Avatar',
      help: 'Recommended 800x800',
    },
    {
      key: 'tags',
      type: 'chips',
      label: 'Tags',
      placeholder: 'Add tags and press Enter',
    },
    {
      key: 'layout',
      type: 'select',
      label: 'Layout',
      options: [
        { value: 'left-image', label: 'Image Left' },
        { value: 'right-image', label: 'Image Right' },
        { value: 'stacked', label: 'Stacked' },
      ],
    },
  ],
};
