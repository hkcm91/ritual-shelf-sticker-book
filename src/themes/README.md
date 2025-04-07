
# Theme Creation Guide

This guide explains how to create and register new themes for your bookshelf application.

## Quick Start

1. Copy the template from `src/themes/template/theme.config.ts` to a new folder with your theme name:
   ```
   src/themes/your-theme-name/theme.config.ts
   ```

2. Edit the variables in your new theme file to customize colors, textures, and other visual elements.

3. Register your theme in `src/themes/index.ts` by:
   - Importing your theme file
   - Adding it to the `themes` object
   - Updating the `ThemeName` type to include your theme name

## Theme Structure

Each theme consists of:

- **name**: Display name shown in the theme selector
- **variables**: CSS variables that control colors, dimensions, and styles
- **textures**: Image paths for shelf wood texture and optional background

## CSS Variables Reference

### Page Variables
- `--page-bg`: Main background color
- `--page-bg-image`: Background image URL or 'none'
- `--page-text-color`: Text color on the page

### Container Variables
- `--container-bg`: Bookshelf background color
- `--container-bg-image`: Container background image URL
- `--container-opacity`: Transparency level (0-1)
- `--container-border-*`: Border width, style, color, and radius
- `--container-padding`: Space inside the container

### Shelf Variables
- `--shelf-thickness`: Height of each shelf
- `--shelf-color`: Color of shelves
- `--shelf-bg-image`: Shelf texture image URL
- `--shelf-opacity`: Shelf transparency (0-1)

### Divider Variables
- `--divider-thickness`: Width of dividers between books
- `--divider-color`: Color of dividers
- `--divider-opacity`: Divider transparency (0-1) 
- `--divider-orientation`: Direction ('vertical' or 'horizontal')

### Slot Variables
- `--slot-add-button-*`: Add button styling
- `--slot-toggle-*`: Toggle button styling
- `--slot-empty-hover-bg`: Empty slot hover effect

### Header Variables
- `--header-bg`: Header background color
- `--header-bg-image`: Header background image URL
- `--header-text-color`: Header text color
- `--header-hover-bg`: Header hover effect color

## Testing Your Theme

After creating and registering your theme, you can:

1. Start the application
2. Open the customization panel
3. Select your theme from the list

## Example: Registering a New Theme

In `src/themes/index.ts`:

```typescript
import defaultTheme from './default/theme.config';
import darkAcademia from './dark-academia/theme.config';
import cozyCottage from './cozy-cottage/theme.config';
import modernLibrary from './modern-library/theme.config';
import yourTheme from './your-theme-name/theme.config';
import { Theme } from './types';

export const themes = {
  'default': defaultTheme,
  'dark-academia': darkAcademia,
  'cozy-cottage': cozyCottage,
  'modern-library': modernLibrary,
  'your-theme-name': yourTheme, // Add your theme here
};

export type ThemeName = keyof typeof themes | 'custom';
export type { Theme };

export default themes;
```
