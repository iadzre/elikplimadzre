# Netlify CMS Setup Guide

## Overview

Netlify CMS has been configured to allow editing of:
- **Project Tiles** - Add, edit, and delete project tiles in the projects page
- **Client Comments** - Edit the testimonials section
- **Homepage Slider** - Add and edit slider images on the homepage

## File Structure

```
├── Admin/                  # Netlify CMS (Root Level)
│   ├── config.yml          # CMS configuration
│   └── index.html          # CMS admin interface
│
└── public/
    ├── data/
    │   ├── projects.json       # Projects data (editable via CMS)
    │   ├── comments.json       # Comments data (editable via CMS)
    │   └── slider.json         # Slider data (editable via CMS)
    ├── media/
    │   └── uploads/            # Media uploads folder (CMS uploads)
    └── js/
        └── cms-loader.js       # Dynamic content loader
```

## Setup Instructions

### 1. Deploy to Netlify

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Set build directory to `public` (or root if public is the root)
4. Deploy

### 2. Enable Git Gateway

1. Go to Netlify Dashboard → Settings → Identity
2. Enable **Identity** service
3. Enable **Git Gateway**
4. Configure registration (invite-only recommended for CMS)

### 3. Configure Netlify Identity

1. Go to Settings → Identity → Services
2. Enable **Git Gateway**
3. Set up email templates (optional)
4. Configure OAuth providers (optional)

### 4. Access CMS

1. Visit: `https://yourdomain.com/Admin/index.html` (Admin folder is at root level, accessible directly)
2. Click "Login with Netlify Identity"
3. Sign up or log in
4. Start editing content!

## CMS Features

### Projects Collection

**Location:** `data/projects.json`

**Fields:**
- **ID**: Unique number for ordering
- **Title**: Project title
- **Category**: e.g., Digital, Photography, Video
- **Subcategory**: e.g., Brand System, Documentary
- **Description**: e.g., "Identity · Branding · Design"
- **Cover Image URL**: Full Cloudinary URL
- **Media Type**: image, video, youtube, or mixed
- **Media Sources**: List of image/video URLs for gallery
- **YouTube ID(s)**: Single ID or comma-separated
- **YouTube Thumbnail ID**: Thumbnail ID for YouTube videos

### Comments Collection

**Location:** `data/comments.json`

**Fields:**
- **ID**: Unique number
- **Quote**: Testimonial text
- **Author Name**: Client name
- **Author Title**: Client title/position

### Slider Collection

**Location:** `data/slider.json`

**Fields:**
- **ID**: Unique number
- **Image URL**: Full Cloudinary URL
- **Alt Text**: Image description
- **Order**: Display order (1, 2, 3...)

## How It Works

1. **CMS Interface**: Edit content via `/Admin/index.html`
2. **Data Storage**: Changes saved to JSON files in `data/` folder
3. **Dynamic Loading**: `cms-loader.js` loads data and renders content
4. **Git Integration**: Changes committed to your repository automatically

## Notes

- The CMS loader is **optional** - if data files don't exist, the site uses existing HTML content
- All images/videos should use Cloudinary URLs
- Changes are saved directly to your Git repository
- No build process required - changes appear immediately after commit

## Troubleshooting

**CMS not loading?**
- Check that Git Gateway is enabled
- Verify Identity service is active
- Ensure you're logged in with Netlify Identity

**Changes not appearing?**
- Wait for Git commit to complete
- Refresh the page
- Check browser console for errors

**Can't edit files?**
- Verify Git Gateway permissions
- Check repository access
- Ensure branch is set to `main` in config.yml

