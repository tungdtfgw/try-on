# Common Errors & Solutions

## Build & Configuration Errors

### TailwindCSS v4 PostCSS Configuration Error

**Error Message:**
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. 
The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS 
with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

**Root Cause:**
TailwindCSS v4 changed its architecture. The PostCSS plugin is now in a separate package `@tailwindcss/postcss` instead of being bundled with `tailwindcss`.

**Solution:**
1. Install the new PostCSS plugin:
   ```bash
   npm install --save-dev @tailwindcss/postcss
   ```

2. Update `postcss.config.js`:
   ```js
   export default {
     plugins: {
       '@tailwindcss/postcss': {},  // Changed from 'tailwindcss'
       autoprefixer: {},
     },
   }
   ```

3. Update `src/index.css` to use v4 syntax:
   ```css
   @import "tailwindcss";  // Instead of @tailwind directives
   ```

**Prevention:**
- When upgrading to TailwindCSS v4, always check for breaking changes in PostCSS configuration
- Review TailwindCSS migration guide before upgrading major versions
