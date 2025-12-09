# Gazzetta Font Setup Guide

## Font Files Required

To enable the local Gazzetta font backup, add these files to this folder:

### Required Files:
- `Gazzetta-Regular.woff2` (preferred - smallest file size)
- `Gazzetta-Regular.woff` (fallback)
- `Gazzetta-Regular.ttf` (fallback)
- `Gazzetta-Bold.woff2` (preferred)
- `Gazzetta-Bold.woff` (fallback)
- `Gazzetta-Bold.ttf` (fallback)

## How to Get Font Files

### Option 1: CDN Fonts (Free)
1. Visit: https://www.cdnfonts.com/gazzetta.font
2. Download the font package
3. Extract the font files
4. Copy `.woff2`, `.woff`, or `.ttf` files to this folder
5. Rename them to match the required names above

### Option 2: MyFonts (Purchase)
1. Visit: https://www.myfonts.com/collections/gazzetta-font-tipotype/
2. Purchase the font license
3. Download the web font package
4. Extract and copy files to this folder

### Option 3: If You Already Have the Font
1. Locate your Gazzetta font files
2. Copy them to this folder
3. Ensure they're named exactly as listed above

## Current Setup

The font is already configured in:
- ✅ `css/styles.css` - @font-face declarations added
- ✅ `about me.html` - CDN link with local backup support

## How It Works

1. **Primary:** Browser tries to load from CDN (`fonts.cdnfonts.com`)
2. **Backup:** If CDN fails, browser uses local font files via `@font-face`
3. **Fallback:** If local files don't exist, uses Inter font

## Testing

After adding font files:
1. Disable internet connection (or block CDN)
2. Reload the about page
3. The name "Elikplim Adzre" should still display in Gazzetta font
4. Check browser console for any font loading errors

## Font Usage

The font is used on the about page for:
- Main heading: "Elikplim Adzre" (uses `.gazzetta-bold` class)

The CSS automatically prioritizes:
1. Local font files (if available)
2. CDN font (if local unavailable)
3. Inter font (fallback)

