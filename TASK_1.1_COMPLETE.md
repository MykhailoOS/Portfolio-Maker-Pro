# Task 1.1 - Schema-driven Inspector with shadcn/ui ✅

## Completed Features

### 1. shadcn/ui Integration ✅
- Installed and configured shadcn/ui with Radix primitives
- Created components: Input, Textarea, Select, Switch, Button, Label, Tooltip
- Configured Tailwind CSS v4 with @tailwindcss/postcss
- CSS variables for theming in dark mode

### 2. Inspector Schema System ✅
- Created type definitions in `schemas/types.ts`:
  - `FieldType`: text, textarea, image, select, switch, chips
  - `FieldDef`: field configuration with label, required, help, options
  - `SectionSchema`: schema definition for sections
  - `ImageValue`: { id, url, alt } for image fields

### 3. About Section Schema ✅
- Schema defined in `schemas/about.ts` with fields:
  - `title`: text (required, localized)
  - `paragraph`: textarea (required, localized)
  - `avatar`: image (with help text "Recommended 800x800")
  - `tags`: chips (array of strings)
  - `layout`: select (left-image, right-image, stacked)

### 4. Universal Inspector Component ✅
- `InspectorNew` component renders fields dynamically based on schema
- Automatic validation for required fields
- Error display beneath invalid fields
- Namespace: `.jsb-editor` class to prevent style leakage

### 5. Field Components ✅
All field components created in `components/Inspector/fields/`:
- `TextField`: shadcn Input with validation
- `TextareaField`: shadcn Textarea with validation
- `SelectField`: shadcn Select with options
- `SwitchField`: shadcn Switch with label
- `ChipsField`: Input + Enter to add, chips with remove button
- `ImageField`: Local stub uploader with:
  - File input (accept="image/*")
  - ObjectURL creation for preview
  - Alt text input
  - Remove button with cleanup
  - Preview thumbnail (48×48 in inspector concept, 32×128 actual)

### 6. Zustand State Management ✅
- Created `store/project.ts` with:
  - `getValue(path)`: get value by dot notation path
  - `setValue(path, value)`: set value by path
  - `updateSection(id, data)`: update section data
  - `undo()` / `redo()`: history management (max 50 entries)
  - `addSection()`, `removeSection()`, `reorderSections()`
  - Full TypeScript typing

### 7. Utility Functions ✅
- `utils/dotPath.ts`: getByPath, setByPath for dot notation navigation

### 8. Canvas Integration ✅
- Updated `AboutSection` in `CanvasContent.tsx`:
  - Supports `avatar.url` (ObjectURL or remote)
  - Displays `tags` as styled chips
  - Three layouts: left-image, right-image, stacked
  - Fallback to `imageUrl` for backward compatibility
  - Reactive to all inspector changes

### 9. Type System Updates ✅
- Extended `AboutSectionData` in `types.ts`:
  - `avatar?: ImageValue`
  - `tags?: string[]`
  - `layout?: 'left-image' | 'right-image' | 'stacked'`
  - Kept `imageUrl` for backward compatibility

### 10. App Integration ✅
- Updated `App.tsx` to use Zustand store
- Schema mapping: `schemaMap` for section type → schema
- `InspectorNew` receives schema dynamically
- TooltipProvider wrapper for shadcn/ui

## File Structure
```
src/
├── components/
│   ├── Inspector/
│   │   ├── InspectorNew.tsx          # Universal schema-driven inspector
│   │   └── fields/
│   │       ├── TextField.tsx
│   │       ├── TextareaField.tsx
│   │       ├── SelectField.tsx
│   │       ├── SwitchField.tsx
│   │       ├── ChipsField.tsx
│   │       └── ImageField.tsx
│   └── ui/                           # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── textarea.tsx
│       ├── select.tsx
│       ├── switch.tsx
│       └── tooltip.tsx
├── schemas/
│   ├── types.ts                      # Schema type definitions
│   └── about.ts                      # About section schema
├── store/
│   └── project.ts                    # Zustand store
├── utils/
│   └── dotPath.ts                    # Path navigation utilities
├── lib/
│   └── utils.ts                      # cn() helper
├── styles.css                        # Tailwind + CSS variables
├── tailwind.config.js
└── postcss.config.js
```

## Testing Checklist ✅

### Manual Testing
1. ✅ **Title/Paragraph editing**: Changes reflect on Canvas immediately
2. ✅ **Tags**: Add 3-5 tags with Enter key, remove with X button, display on Canvas
3. ✅ **Image upload**: 
   - Upload image → preview appears
   - Upload second image → first ObjectURL revoked, new preview shown
   - Remove image → ObjectURL cleaned up
4. ✅ **Layout switching**: Toggle left/right/stacked → Canvas updates layout
5. ✅ **Validation**: Clear title → red border + error message below field
6. ✅ **Localization**: Switch locale → inspector shows localized values

### Technical Validation
- ✅ No console errors
- ✅ TypeScript compilation passes
- ✅ Build succeeds (npm run build)
- ✅ No style leakage to Canvas content
- ✅ Memory cleanup for ObjectURLs

## Key Implementation Details

### ImageField Stub Upload
```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) return;
  
  // Revoke previous URL
  if (previousUrlRef.current?.startsWith('blob:')) {
    URL.revokeObjectURL(previousUrlRef.current);
  }
  
  const url = URL.createObjectURL(file);
  onChange({ id: generateUUID(), url, alt: value?.alt || '' });
};
```

### Schema-Driven Rendering
```typescript
const renderField = (field: FieldDef) => {
  switch (field.type) {
    case 'text': return <TextField ... />;
    case 'image': return <ImageField ... />;
    // ... other types
  }
};
```

## Next Steps (Future Tasks)
- Add more section schemas (Hero, Skills, Projects, Contact)
- Integrate Directus for real image upload
- Add rich text editor for textarea fields
- Export validation (disable export if required fields empty)
- Add more field types (color picker, date, number, etc.)
