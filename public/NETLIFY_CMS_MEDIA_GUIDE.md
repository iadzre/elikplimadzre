# Netlify CMS Media Handling Guide

## Overview

This guide explains how media uploads work in your Netlify CMS setup and how to properly use uploaded images throughout your website.

## Media Upload Configuration

### Upload Location
- **Storage Folder:** `public/media/uploads/`
- **Public URL:** `/media/uploads/filename.jpg`
- **Full URL:** `https://yourdomain.com/media/uploads/filename.jpg`

## How Media Uploads Work

### 1. Image Upload Widget
The CMS uses the `image` widget which provides:
- **Upload Interface:** Click to upload images directly
- **Media Library:** Browse previously uploaded images
- **URL Support:** Can also accept external URLs (Cloudinary, etc.)

### 2. Upload Process
1. Click the image field in CMS
2. Choose "Upload new file" or select from media library
3. File is saved to `public/media/uploads/`
4. URL is automatically generated: `/media/uploads/filename.jpg`

### 3. Using Uploaded Images

#### In Projects
- **Cover Image:** Upload directly or use Cloudinary URL
- **Media Sources:** Upload multiple images for gallery
- **Fallback:** If you prefer Cloudinary, use the "URL (Alternative)" field

#### In Slider
- **Slider Images:** Upload directly or use Cloudinary URL
- **Fallback:** Use "Image URL (Alternative)" for Cloudinary URLs

## Media URL Formats

### Supported Formats

1. **Uploaded Media:**
   ```
   /media/uploads/image.jpg
   ```

2. **Cloudinary URLs:**
   ```
   https://res.cloudinary.com/dimolecad/image/upload/v1765236106/cover_hsbnd4.jpg
   ```

3. **Relative Paths:**
   ```
   /media/uploads/filename.jpg
   ```

## Frontend Integration

The `cms-loader.js` automatically handles different URL formats:

```javascript
// Automatically converts:
- Uploaded files: /media/uploads/image.jpg
- Cloudinary URLs: https://res.cloudinary.com/...
- Relative paths: /media/uploads/filename.jpg
```

## Best Practices

### 1. Image Optimization
- Upload optimized images (compressed, appropriate size)
- Recommended formats: JPG, PNG, WebP
- Max file size: Keep under 5MB for faster uploads

### 2. Naming Conventions
- Use descriptive filenames: `project-cover-christa-valley.jpg`
- Avoid spaces: Use hyphens or underscores
- Include project/context in filename

### 3. Cloudinary vs Local Uploads
- **Cloudinary:** Better for CDN, optimization, transformations
- **Local Uploads:** Simpler, no external dependencies
- **Hybrid:** Use Cloudinary for existing assets, uploads for new content

### 4. Media Sources Array
When adding multiple images to a project:
- Each image can be uploaded individually
- Or use Cloudinary URLs
- Mix both formats as needed

## Troubleshooting

### Images Not Displaying

1. **Check URL Format:**
   - Uploaded: `/media/uploads/filename.jpg`
   - Cloudinary: Full URL starting with `https://`

2. **Verify File Exists:**
   - Check `public/media/uploads/` folder
   - Ensure file was committed to Git

3. **Check Browser Console:**
   - Look for 404 errors
   - Verify path is correct

### Upload Fails

1. **File Size:**
   - Reduce image size/quality
   - Use image compression tools

2. **File Format:**
   - Use JPG, PNG, or WebP
   - Avoid unsupported formats

3. **Git Gateway:**
   - Ensure Git Gateway is enabled
   - Check repository permissions

## Media Library Features

### Reusing Uploaded Images
- Previously uploaded images appear in media library
- Click to reuse without re-uploading
- Saves storage and upload time

### Organizing Media
- Files are stored in `public/media/uploads/`
- Consider organizing by date or project
- Use descriptive filenames for easy identification

## Migration from Cloudinary

If you want to migrate from Cloudinary to local uploads:

1. Download images from Cloudinary
2. Upload through CMS interface
3. Update JSON files with new URLs
4. Or keep Cloudinary URLs in "Alternative URL" fields

## Example Usage

### Adding a New Project with Uploaded Images

1. Go to CMS → Projects
2. Click "Add entry"
3. Fill in project details
4. **Cover Image:**
   - Click "Cover Image" field
   - Upload new image or select from library
5. **Media Sources:**
   - Click "Add item" in Media Sources
   - Upload each gallery image
6. Save - images are automatically uploaded and URLs generated

### Using Cloudinary URLs

1. Get Cloudinary URL
2. Use "Cover Image URL (Alternative)" field
3. Or paste directly into Media Sources URL field
4. CMS will use the Cloudinary URL

## File Structure

```
public/
├── media/
│   └── uploads/          # All CMS uploads
│       ├── image1.jpg
│       ├── image2.png
│       └── ...
└── data/
    ├── projects.json      # References /media/uploads/ URLs
    ├── comments.json
    └── slider.json       # References /media/uploads/ URLs
```

## Security Notes

- Uploaded files are version controlled in Git
- Files are publicly accessible at `/media/uploads/`
- Consider file size limits for repository
- Use `.gitignore` if you want to exclude large files (not recommended for CMS)

