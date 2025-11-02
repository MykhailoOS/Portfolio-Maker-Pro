# Implementation Notes - Task 1.1

## Implementation Approach

### 1. Tailwind CSS v4 Migration
Initially, the project used Tailwind via CDN. For shadcn/ui compatibility, we:
- Installed `tailwindcss` and `@tailwindcss/postcss`
- Created `tailwind.config.js` with brand colors and CSS variable mappings
- Created `styles.css` with @tailwind directives and CSS variables
- Updated `postcss.config.js` to use `@tailwindcss/postcss`

### 2. shadcn/ui Setup
Instead of using `npx shadcn init` (which had issues), we:
- Manually created `components.json` configuration
- Installed Radix UI primitives directly
- Created shadcn/ui components manually in `components/ui/`
- This gives us full control and avoids CLI dependency issues

### 3. State Management with Zustand
Chose Zustand over Redux/Context because:
- Minimal boilerplate
- Built-in TypeScript support
- Easy to add undo/redo
- Performance optimized with selectors
- Simple API: `getValue()`, `setValue()`, `updateSection()`

Implemented history management:
- `past` array: previous states (max 50)
- `present`: current state
- `future` array: redo states
- Operations clear future on new changes

### 4. Schema-driven Architecture
Why schema-driven?
- **Scalability**: Add new sections by creating schema files only
- **Consistency**: All fields rendered with same validation/styling
- **Maintainability**: Inspector logic in one place
- **Type Safety**: Schemas define structure, TypeScript enforces it

Schema structure:
```typescript
{
  type: 'about',
  fields: [
    { key: 'title', type: 'text', required: true, ... },
    { key: 'avatar', type: 'image', help: '...', ... }
  ]
}
```

### 5. Image Field Implementation
Stub upload approach:
- Uses `URL.createObjectURL()` for instant preview
- Stores: `{ id: uuid(), url: 'blob:...', alt: '...' }`
- Cleanup: `URL.revokeObjectURL()` on remove/replace
- Ready for Directus: structure matches expected API response

Benefits:
- No backend needed for development
- Instant feedback
- Easy to swap with real upload later

### 6. Namespace Strategy
Problem: Tailwind styles leak to Canvas content (exported HTML)

Solution: `.jsb-editor` class on Inspector root
- All shadcn/ui components scoped within
- Canvas content remains unstyled by editor UI
- Export HTML is clean

### 7. Validation Approach
Current: Client-side only
- Required fields checked on render
- Visual feedback: red border + error message
- Aggregated errors at bottom

Future: Add export validation
- Disable export button if errors exist
- Show validation summary dialog

### 8. Localization Flow
Structure: `{ en: '...', ua: '...', ru: '...', pl: '...' }`

Flow:
1. User selects locale in TopBar
2. Inspector shows `value[activeLocale]`
3. User edits → updates only active locale
4. Canvas displays `data.field[activeLocale]`
5. Other locales preserved

## Design Decisions

### Why not React Hook Form?
- Schema already defines validation
- Simple fields don't need heavy abstraction
- Direct state updates to Zustand cleaner
- May add for complex forms later

### Why not Zod for validation?
- Current validation is simple (required/empty check)
- Zod adds bundle size
- Schema already contains rules
- May add for complex validation later

### Why separate field components?
- Reusability across different inspectors
- Testing isolation
- Easy to extend (e.g., add color picker field)
- Clear separation of concerns

### Why ImageValue structure?
```typescript
{ id: string; url: string; alt?: string }
```
- `id`: Track changes, prepare for Directus ID
- `url`: Works with both ObjectURL and remote URLs
- `alt`: Accessibility ready
- Matches typical CMS image response

## Performance Considerations

1. **Zustand selectors**: Use `useProjectStore(state => state.present)` for granular updates
2. **Memoization**: `useMemo` for derived values (errors, schema)
3. **Key prop**: Inspector re-mounts on section change to reset state
4. **Lazy loading**: ThreeScene already lazy-loaded
5. **ObjectURL cleanup**: useEffect cleanup prevents memory leaks

## Testing Strategy

Manual testing focused on:
1. **Data flow**: Inspector → Store → Canvas
2. **Validation**: Required fields, error display
3. **Image upload**: Preview, replace, remove, cleanup
4. **Localization**: Switch locales, preserve values
5. **Layouts**: Visual changes on Canvas

Future: Add unit tests for:
- Store actions (updateSection, undo, redo)
- Field components (validation, onChange)
- Schema validation logic

## Known Limitations

1. **Undo/Redo UI**: Store supports it, but no UI buttons yet
2. **Export validation**: Logic ready, but not integrated with export button
3. **Single section schema**: Only About has schema, others use old Inspector
4. **No rich text**: Textarea is plain text (sufficient for now)
5. **Image validation**: File type only, no size/dimension checks

## Migration Path for Other Sections

To add schema for another section:

1. Create `schemas/[section-type].ts`:
```typescript
export const heroSchema: SectionSchema = {
  type: 'hero',
  fields: [
    { key: 'headline', type: 'text', required: true },
    // ... more fields
  ]
};
```

2. Add to `schemaMap` in `App.tsx`:
```typescript
const schemaMap: Record<string, SectionSchema> = {
  about: aboutSchema,
  hero: heroSchema, // Add here
};
```

3. Done! Inspector automatically renders fields

## Troubleshooting

### Tailwind styles not applying
- Check `@tailwindcss/postcss` is in `postcss.config.js`
- Ensure `styles.css` is imported in `index.tsx`
- Verify CSS variables in `:root`

### Store not updating Canvas
- Check `present` object in store (React DevTools)
- Verify `updateSection()` is called with correct ID
- Ensure Canvas uses `portfolio.sections` from store

### Image preview not showing
- Check ObjectURL starts with `blob:`
- Verify file input accepts `image/*`
- Look for CORS errors in console

### TypeScript errors
- Run `npx tsc --noEmit` to see all errors
- Check imports use correct paths
- Verify all types exported from `types.ts`

## Next Steps (Not in this task)

1. Add schemas for remaining sections
2. Implement undo/redo UI buttons
3. Add export validation check
4. Integrate Directus for real uploads
5. Add field types: color, date, number, rich-text
6. Add unit tests
7. Add E2E tests with Playwright
8. Optimize bundle size (code splitting)
