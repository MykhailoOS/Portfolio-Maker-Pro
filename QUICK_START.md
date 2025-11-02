# Quick Start Guide - Schema-driven Inspector

## Running the Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Testing the New Features

### 1. Open the Application
Navigate to `http://localhost:3000` in your browser.

### 2. Select About Section
- Click on the "About Me" section in the Canvas
- The Inspector panel will open on the right (or bottom on mobile)

### 3. Edit Text Fields
- **Title**: Edit the title in your active locale (default: English)
- **Paragraph**: Edit the description text
- Changes appear instantly on the Canvas

### 4. Upload an Image (Stub Upload)
- Click "Upload Image" button in the Avatar field
- Select any image from your computer
- Preview appears immediately
- Add alt text (optional)
- Click X to remove and upload a different image

### 5. Add Tags
- Type a tag name in the "Tags" field
- Press Enter to add it
- Repeat to add multiple tags
- Click X on any chip to remove it
- Tags appear as styled chips on the Canvas

### 6. Change Layout
- Select from dropdown: Image Left / Image Right / Stacked
- Canvas updates immediately to show new layout

### 7. Test Validation
- Clear the Title field completely
- Notice red border appears
- Error message "This field is required" shows below
- Fill it back in and error disappears

### 8. Test Localization
- Switch locale using the language selector in TopBar
- Inspector shows values for selected locale
- Edit text in different locale
- Switch back to see changes preserved

## Architecture Highlights

### Zustand Store
- Centralized state management
- Undo/redo support (press Ctrl+Z / Ctrl+Y - if implemented in UI)
- All changes flow through store methods

### Schema-driven Inspector
- Adding new fields requires only schema updates
- No Inspector code changes needed
- Validation rules defined in schema

### Image Upload
- Local stub: uses `URL.createObjectURL()`
- Automatic cleanup on remove/replace
- Structure: `{ id: uuid(), url: 'blob:...', alt: '...' }`
- Ready for Directus integration (Task 1.2+)

## File Locations

- **Schemas**: `schemas/about.ts`
- **Store**: `store/project.ts`
- **Inspector**: `components/Inspector/InspectorNew.tsx`
- **Fields**: `components/Inspector/fields/*.tsx`
- **shadcn/ui**: `components/ui/*.tsx`

## Common Issues

### Tailwind not working
- Ensure `@tailwindcss/postcss` is installed
- Check `postcss.config.js` uses `@tailwindcss/postcss`

### Images not displaying
- Check browser console for CORS errors
- Ensure file input accepts `image/*`
- ObjectURL should start with `blob:`

### Inspector not updating Canvas
- Verify Zustand store is receiving updates
- Check `present` object in store
- Ensure section ID matches

## Next Steps
- Add schemas for other sections (Hero, Skills, Projects, Contact)
- Implement undo/redo UI buttons
- Add export validation (disable if required fields empty)
- Integrate Directus for real image uploads
