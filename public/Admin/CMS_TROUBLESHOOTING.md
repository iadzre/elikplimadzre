# Netlify CMS Troubleshooting Guide

## ✅ Configuration Verification

### **Admin Folder Structure**
```
Admin/
├── index.html      ✅ CMS admin interface entry point
├── config.yml      ✅ CMS configuration file
└── README.md       ✅ Setup documentation
```

### **File Paths** ✅
All paths in `config.yml` are correct and relative to repository root:
- ✅ Projects: `public/data/projects.json`
- ✅ Comments: `public/data/comments.json`
- ✅ Slider: `public/data/slider.json`
- ✅ Media folder: `public/media/uploads`

### **Backend Configuration** ✅
- ✅ Backend: Git Gateway
- ✅ Branch: main
- ✅ Site URL: https://elikplimadzre.com

### **Collections** ✅
All 3 collections are properly configured:
1. ✅ Projects - Manage project tiles
2. ✅ Comments - Manage client testimonials
3. ✅ Slider - Manage homepage slider images

---

## 🔧 Common Issues & Fixes

### **Issue 1: Admin Page Not Loading**

**Symptoms:**
- Blank page at `/admin`
- Console errors about Netlify CMS

**Solutions:**
1. **Verify Admin folder location:**
   - Admin folder must be at repository root: `elikplimadzre/Admin/`
   - NOT inside `public/` folder

2. **Check Netlify build settings:**
   - Build directory: `public`
   - Publish directory: `public`
   - Admin folder should be accessible at root level

3. **Verify index.html:**
   - File must be at: `Admin/index.html`
   - Must include Netlify CMS script

4. **Check Netlify routing:**
   - Add redirect rule in `public/_redirects`:
     ```
     /admin/*  /admin/index.html  200
     ```

### **Issue 2: Git Gateway Not Working**

**Symptoms:**
- "No backend found" error
- Cannot login to CMS

**Solutions:**
1. **Enable Git Gateway in Netlify:**
   - Go to: Site Settings → Identity
   - Enable "Identity"
   - Enable "Git Gateway"
   - Save changes

2. **Configure Identity:**
   - Set registration to "Invite only" (recommended)
   - Or "Open" for testing

3. **Check repository connection:**
   - Verify repository is connected to Netlify
   - Check branch is set to `main`

### **Issue 3: Cannot Save Changes**

**Symptoms:**
- Changes don't save
- "Failed to persist entry" error

**Solutions:**
1. **Check file paths:**
   - Verify JSON files exist at paths specified in config.yml
   - Check file permissions

2. **Verify Git Gateway:**
   - Ensure Git Gateway is enabled
   - Check repository access permissions

3. **Check branch:**
   - Config.yml specifies `branch: main`
   - Ensure repository uses `main` branch (not `master`)

### **Issue 4: Media Uploads Not Working**

**Symptoms:**
- Cannot upload images
- Images don't appear after upload

**Solutions:**
1. **Verify media folder:**
   - Folder must exist: `public/media/uploads/`
   - Check folder permissions

2. **Check paths in config.yml:**
   - `media_folder: "public/media/uploads"` ✅
   - `public_folder: "/media/uploads"` ✅

3. **Verify .gitignore:**
   - Don't ignore `public/media/uploads/`
   - Media files should be committed to Git

### **Issue 5: Collections Not Showing**

**Symptoms:**
- CMS loads but no collections visible
- Collections show but are empty

**Solutions:**
1. **Check config.yml syntax:**
   - Verify YAML indentation (2 spaces)
   - Check for syntax errors

2. **Verify JSON file structure:**
   - Projects: `{"projects": [...]}`
   - Comments: `{"comments": [...]}`
   - Slider: `{"slider": [...]}`

3. **Check file paths:**
   - Paths must be relative to repository root
   - Example: `public/data/projects.json` ✅

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- [ ] Admin folder is at repository root (`elikplimadzre/Admin/`)
- [ ] `Admin/index.html` exists and includes Netlify CMS script
- [ ] `Admin/config.yml` has correct file paths
- [ ] All JSON files exist at specified paths
- [ ] `public/media/uploads/` folder exists
- [ ] Git Gateway is enabled in Netlify
- [ ] Identity is enabled in Netlify
- [ ] Repository branch matches config.yml (`main`)
- [ ] Build directory is set to `public` in Netlify

---

## 🔗 Accessing the CMS

### **After Deployment:**
1. Visit: `https://elikplimadzre.com/admin`
2. Click "Login with Netlify Identity"
3. Check email for login link
4. Start editing content

### **Local Testing:**
1. Run local server: `python3 -m http.server 8000` (in `public/` folder)
2. Visit: `http://localhost:8000/admin`
3. Note: Git Gateway won't work locally, but you can test the interface

---

## 📝 Configuration Notes

### **File Paths:**
- All paths in `config.yml` are relative to repository root
- Example: `public/data/projects.json` means file is at repo root → `public/data/projects.json`

### **Media Handling:**
- Uploaded images go to: `public/media/uploads/`
- Accessible at: `/media/uploads/filename.jpg`
- Can also use Cloudinary URLs directly

### **JSON Structure:**
- Projects: `{"projects": [array of project objects]}`
- Comments: `{"comments": [array of comment objects]}`
- Slider: `{"slider": [array of slide objects]}`

---

## 🆘 Still Having Issues?

1. **Check Netlify Build Logs:**
   - Look for errors during build
   - Verify all files are being deployed

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Verify Repository:**
   - Ensure all files are committed
   - Check that Admin folder is tracked by Git

4. **Test Configuration:**
   - Use Netlify CMS documentation: https://www.netlifycms.org/docs/
   - Verify config.yml syntax matches examples

---

**Last Updated:** 2025-12-09  
**CMS Version:** Netlify CMS 2.10.0

