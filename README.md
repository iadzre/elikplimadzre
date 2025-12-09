# Elikplim Adzre - Portfolio Website

A modern, responsive portfolio website showcasing illustration, film, photography, and design work.

## 🌐 Live Website
elikplimadzre.com

## 📋 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Image Slider**: Auto-playing image carousel on homepage
- **Project Gallery**: Interactive project tiles with modal views
- **YouTube Integration**: Embedded YouTube videos with custom controls
- **Video Gallery**: Support for MP4 video playback
- **Contact Form**: Netlify Forms integration
- **Cloudinary CDN**: All images and videos served via Cloudinary
- **Accessibility**: WCAG compliant with keyboard navigation and ARIA labels

## 🛠️ Technologies

- **HTML5**: Semantic markup
- **CSS3**: Tailwind CSS + custom styles
- **JavaScript (ES6+)**: Vanilla JavaScript, no frameworks
- **Cloudinary**: CDN for images and videos
- **Netlify**: Form handling and deployment

## 📁 Project Structure

```
public/
├── index.html          # Home page with image slider
├── projects.html       # Projects gallery
├── about me.html       # About page with timeline
├── leave a note.html   # Contact form
├── css/
│   └── styles.css     # Custom CSS styles
├── js/
│   ├── main.js        # Main JavaScript (modals, cursor, forms)
│   └── about-me.js    # About page specific scripts
└── fonts/             # Custom fonts (if any)
```

## 🚀 Getting Started

### Prerequisites
- A web server (or use a static site host like Netlify)
- Cloudinary account (for media assets)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd "ELi ii"
```

2. Open `public/index.html` in a web browser or deploy to a web server.

### Cloudinary Setup

All images and videos are served via Cloudinary. The website uses:
- **Cloud Name**: `dimolecad`
- **Base URL**: `https://res.cloudinary.com/dimolecad/`

Ensure your Cloudinary account has all the required media assets uploaded.

## 📝 Pages

### Home (`index.html`)
- Image slider with 5 slides
- Auto-play functionality
- Responsive header with navigation

### Projects (`projects.html`)
- Grid layout of project tiles
- Modal views for image galleries
- YouTube video integration
- Video playback support

### About Me (`about me.html`)
- Profile section
- Skills display
- Software icons infinite loop
- Career timeline

### Contact (`leave a note.html`)
- Netlify Forms integration
- Form validation
- Spam protection (honeypot)

## 🎨 Customization

### Colors
Primary colors are defined in Tailwind classes:
- Primary Orange: `#F45D01`
- Primary Blue: `#2A2F7F`
- Background: `#f3fcf0`

### Fonts
- Inter (Google Fonts)
- Josefin Sans (Google Fonts)
- Montserrat (Google Fonts)
- Custom fonts: Variex OT, Gazzetta, New Kansas

## 📦 Deployment

### Netlify (Recommended)
1. Connect your Git repository to Netlify
2. Set build directory to `public`
3. Deploy

### Other Platforms
The website is static and can be deployed to any static hosting service:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

## 🔧 Utility Scripts

The repository includes utility scripts for Cloudinary management:
- `convert_to_cloudinary.py`: Convert local paths to Cloudinary URLs
- `add_cloudinary_folder.py`: Add folder prefix to Cloudinary URLs
- `replace_cloud_name.sh`: Replace Cloudinary cloud name placeholder

## 📄 License

See [LICENSE](LICENSE) file for details.

## 👤 Author

**Elikplim Adzre**
- Portfolio: [Your Portfolio URL]
- Instagram: [@still_eli](https://www.instagram.com/still_eli/)
- YouTube: [@eli_kplim](https://www.youtube.com/@eli_kplim)

## 🙏 Acknowledgments

- Tailwind CSS for utility-first styling
- Cloudinary for media CDN
- Netlify for form handling
