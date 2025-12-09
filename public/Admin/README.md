# Netlify CMS Admin Setup

This folder contains the Netlify CMS admin interface for managing website content.

## 📁 Files

- **`index.html`** - Entry point for the CMS admin interface (accessible at `/admin`)
- **`config.yml`** - Configuration file defining collections, fields, and media settings

## 🚀 Setup Instructions

### 1. Deploy to Netlify

1. Push your repository to GitHub
2. Connect your repository to Netlify
3. Enable **Git Gateway** in Netlify settings:
   - Go to **Settings** → **Identity**
   - Enable **Identity**
   - Enable **Git Gateway**
   - Configure registration (invite-only recommended)

### 2. Access the Admin Interface

After deployment, access the CMS at:
```
https://elikplimadzre.com/admin
```

### 3. First Login

1. Click **"Login with Netlify Identity"**
2. Check your email for the login link
3. Once logged in, you can edit content

## 📋 Collections

### Projects
- **File:** `public/data/projects.json`
- **Purpose:** Manage project tiles on the projects page
- **Fields:** ID, Title, Category, Subcategory, Description, Cover Image, Media Type, Media Sources, YouTube IDs

### Comments
- **File:** `public/data/comments.json`
- **Purpose:** Manage client testimonials
- **Fields:** ID, Quote, Author Name, Author Title

### Slider
- **File:** `public/data/slider.json`
- **Purpose:** Manage homepage slider images
- **Fields:** ID, Image, Alt Text, Order

## 🖼️ Media Management

### Uploading Images
- Images uploaded via CMS are saved to: `public/media/uploads/`
- Accessible at: `/media/uploads/filename.jpg`

### Using Cloudinary URLs
- You can paste full Cloudinary URLs directly
- If both uploaded image and URL are provided, the URL takes priority

## ⚙️ Configuration Details

### Backend
- **Type:** Git Gateway
- **Branch:** main
- **Media Folder:** `public/media/uploads`
- **Public Folder:** `/media/uploads`

### Site Settings
- **Site URL:** https://elikplimadzre.com
- **Display URL:** https://elikplimadzre.com
- **Logo:** Portfolio logo from Cloudinary

## 🔧 Troubleshooting

### Admin page shows blank
- Ensure Git Gateway is enabled in Netlify
- Check that Identity is enabled
- Verify the `config.yml` file is valid YAML

### Changes not appearing
- Check that `cms-loader.js` is included in your HTML pages
- Verify JSON files are in the correct location
- Check browser console for errors

### Media uploads not working
- Ensure `public/media/uploads/` folder exists
- Check Netlify build settings
- Verify media folder path in `config.yml`

## 📝 Notes

- All changes are committed directly to your Git repository
- The CMS uses the same Git credentials configured for the repository
- Changes appear on the live site after Netlify rebuilds (automatic on push)

## 🔗 Resources

- [Netlify CMS Documentation](https://www.netlifycms.org/docs/)
- [Git Gateway Setup](https://www.netlifycms.org/docs/git-gateway-backend/)
- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/)

