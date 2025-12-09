/**
 * CMS Data Loader
 * Loads projects, comments, and slider data from JSON files
 * Works with both aggregated JSON files and individual files
 */

// Conditional logging - disabled in production
const DEBUG = false; // Set to true for development debugging
const logger = {
    log: (...args) => DEBUG && console.log(...args),
    error: (...args) => DEBUG && console.error(...args),
    warn: (...args) => DEBUG && console.warn(...args)
};

// Load all projects from individual files or aggregated JSON
async function loadProjects() {
    try {
        // Try aggregated file first
        const response = await fetch('/data/projects.json');
        if (response.ok) {
            const data = await response.json();
            // Handle both formats: array or object with projects key
            const projects = Array.isArray(data) ? data : (data.projects || []);
            renderProjects(projects);
            return;
        }
    } catch (error) {
        logger.log('Aggregated file not found, trying individual files...');
    }

    // Fallback: Load individual files
    try {
        const projects = await loadIndividualProjects();
        if (projects.length > 0) {
            renderProjects(projects);
        }
    } catch (error) {
        logger.error('Error loading projects:', error);
    }
}

// Load individual project files
async function loadIndividualProjects() {
    const projects = [];
    // This would require a list endpoint or predefined file names
    // For now, we'll rely on the aggregated JSON file
    return projects;
}

// Render projects to the grid
function renderProjects(projects) {
    // Try multiple selectors to find the grid
    const grid = document.getElementById('projects-grid') || 
                 document.querySelector('.grid.grid-cols-2.sm\\:grid-cols-2.lg\\:grid-cols-3') ||
                 document.querySelector('.grid.grid-cols-2');
    if (!grid) {
        logger.warn('Projects grid not found, CMS data loaded but not rendered');
        return;
    }

    // Sort by ID
    projects.sort((a, b) => a.id - b.id);

    // Clear existing tiles (keep structure, just replace content)
    const existingTiles = grid.querySelectorAll('.project-tile');
    existingTiles.forEach(tile => tile.remove());

    projects.forEach(project => {
        const tile = createProjectTile(project);
        grid.appendChild(tile);
    });

    // Re-initialize modal handlers for new tiles
    setTimeout(() => {
        reinitializeProjectTiles();
    }, 100);
}

// Create a project tile element
function createProjectTile(project) {
    const article = document.createElement('article');
    article.className = 'project-tile relative aspect-square w-full border border-gray-200 cursor-pointer hover:border-[#F45D01] hover:shadow-lg transition-all duration-300 group overflow-hidden';
    
    // Set data attributes
    article.setAttribute('data-media-type', project.mediaType || 'image');
    
    if (project.mediaSources && project.mediaSources.length > 0) {
        // Handle media sources - support both uploaded media and Cloudinary URLs
        // Support both formats: array of strings OR array of objects with 'url' property
        const processedSources = project.mediaSources.map(source => {
            let url = '';
            
            // Handle different source formats
            if (typeof source === 'string') {
                url = source;
            } else if (source && typeof source === 'object') {
                // CMS saves as object with 'url' property
                url = source.url || source.src || String(source);
            } else {
                url = String(source);
            }
            
            // Process URL
            if (url && typeof url === 'string' && url.trim() !== '') {
                if (url.startsWith('/media/uploads/')) {
                    return url;
                } else if (url.startsWith('http')) {
                    return url;
                } else {
                    return `/media/uploads/${url}`;
                }
            }
            return null;
        }).filter(url => url !== null); // Remove any null/empty URLs
        
        if (processedSources.length > 0) {
            article.setAttribute('data-media-srcs', processedSources.join(','));
        }
    }
    
    if (project.youtubeId) {
        article.setAttribute('data-youtube-id', project.youtubeId);
        article.setAttribute('data-youtube-thumbnail', project.youtubeThumbnail || project.youtubeId.split(',')[0]);
    }

    // Determine label sizes based on category length
    const labelSize = project.category.length > 8 ? 'text-[6px]' : 'text-[6px] sm:text-[7px] md:text-[8px]';
    const titleSize = project.title.length > 25 ? 'text-xs' : 'text-xs sm:text-sm';

    // Handle cover image - support both uploaded media and Cloudinary URLs
    // Priority: coverImageUrl (Cloudinary) > coverImage (uploaded)
    // Handle both string URLs and object format from CMS
    let coverImage = project.coverImageUrl || project.coverImage || '';
    
    // If coverImage is an object (from CMS), extract the URL
    if (coverImage && typeof coverImage === 'object') {
        coverImage = coverImage.url || coverImage.src || '';
    }
    
    let coverImageSrc = '';
    if (coverImage) {
        if (typeof coverImage === 'string' && coverImage.startsWith('http')) {
            // Full URL (Cloudinary or external)
            coverImageSrc = coverImage;
        } else if (typeof coverImage === 'string' && coverImage.startsWith('/media/uploads/')) {
            // Already has full path
            coverImageSrc = coverImage;
        } else if (typeof coverImage === 'string') {
            // Just filename, add path
            coverImageSrc = `/media/uploads/${coverImage}`;
        }
    }
    
    // Fallback to placeholder if no cover image
    if (!coverImageSrc) {
        coverImageSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f3f3" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    }
    
    // Build HTML
    article.innerHTML = `
        <img src="${coverImageSrc}" alt="${project.title}" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div class="absolute inset-0 p-2 sm:p-3 flex flex-col justify-between z-10">
            <div class="flex items-center justify-between">
                <span class="${labelSize} uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-300 josefin">${project.category}</span>
                <span class="${labelSize} uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-300 josefin">${project.subcategory}</span>
            </div>
            <div>
                <h3 class="${titleSize} font-semibold text-white group-hover:text-[#F45D01] transition-colors duration-300 leading-tight">${project.title}</h3>
                <p class="text-[7px] sm:text-[8px] md:text-[9px] josefin tracking-2x uppercase text-gray-200 mt-0.5 sm:mt-1">${project.description}</p>
            </div>
        </div>
    `;

    return article;
}

// Load comments and render
async function loadComments() {
    try {
        const response = await fetch('/data/comments.json');
        if (response.ok) {
            const data = await response.json();
            // Handle both formats: array or object with comments key
            const comments = Array.isArray(data) ? data : (data.comments || []);
            renderComments(comments);
            return;
        }
    } catch (error) {
        logger.log('Comments file not found');
    }
}

function renderComments(comments) {
    const wrapper = document.querySelector('.client-comments-wrapper');
    if (!wrapper) return;

    // Sort by ID
    comments.sort((a, b) => a.id - b.id);

    wrapper.innerHTML = '';

    comments.forEach(comment => {
        const card = document.createElement('div');
        card.className = 'client-comment-card min-w-full flex-shrink-0 px-4 sm:px-6 md:px-8';
        card.innerHTML = `
            <div class="text-center w-full">
                <p class="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose mb-4 sm:mb-5 md:mb-6 w-full max-w-full sm:max-w-lg md:max-w-2xl mx-auto px-2 sm:px-0">
                    "${comment.quote}"
                </p>
                <div class="flex flex-col items-center">
                    <h4 class="font-semibold text-[#F45D01] text-xs sm:text-sm md:text-base mb-1 sm:mb-1.5 uppercase tracking-[0.15em] sm:tracking-[0.2em]">${comment.author}</h4>
                    <p class="text-[9px] sm:text-[10px] md:text-xs text-[#2A2F7F] uppercase tracking-[0.3em] sm:tracking-[0.4em]">${comment.title}</p>
                </div>
            </div>
        `;
        wrapper.appendChild(card);
    });

    // Update indicators (non-clickable, visual only)
    updateCommentIndicators(comments.length);
    
    // Re-initialize comment carousel after CMS loads
    // Trigger the carousel initialization from main.js
    setTimeout(() => {
        // Dispatch custom event to reinitialize carousel
        const event = new CustomEvent('commentsLoaded');
        document.dispatchEvent(event);
    }, 100);
}

function updateCommentIndicators(count) {
    // Find the indicators container
    const commentsSection = document.querySelector('.client-comments-section');
    if (!commentsSection) return;
    
    let indicatorsContainer = commentsSection.querySelector('.flex.justify-center.items-center.space-x-2');
    if (!indicatorsContainer) {
        // Create if doesn't exist
        indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'flex justify-center items-center space-x-2 sm:space-x-2.5 md:space-x-3 mt-4 sm:mt-5 md:mt-6';
        const parentDiv = commentsSection.querySelector('.w-full.max-w-\\[90\\%\\]');
        if (parentDiv) {
            parentDiv.appendChild(indicatorsContainer);
        }
    }

    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const indicator = document.createElement('div');
        if (i === 0) {
            // Active indicator - matches ELi ii project (non-clickable)
            indicator.className = 'comment-indicator w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-2.5 md:h-2.5 rounded-full bg-[#F45D01] transition-all duration-300';
        } else {
            // Inactive indicator - matches ELi ii project (non-clickable)
            indicator.className = 'comment-indicator w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-2.5 md:h-2.5 rounded-full bg-gray-300 transition-all duration-300';
        }
        indicator.setAttribute('data-index', i);
        indicatorsContainer.appendChild(indicator);
    }
}

// Load slider images
async function loadSlider() {
    try {
        const response = await fetch('/data/slider.json');
        if (response.ok) {
            const data = await response.json();
            // Handle both formats: array or object with slider key
            const slides = Array.isArray(data) ? data : (data.slider || []);
            renderSlider(slides);
            return;
        }
    } catch (error) {
        logger.log('Slider file not found');
    }
}

function renderSlider(slides) {
    const slider = document.getElementById('image-slider');
    if (!slider) return;

    // Sort by order
    slides.sort((a, b) => a.order - b.order);

    // Remove existing images (keep overlay)
    const existingImages = slider.querySelectorAll('.slider-image');
    existingImages.forEach(img => img.remove());

    // Add new images
    slides.forEach((slide, index) => {
        const img = document.createElement('img');
        // Handle image URL - support both uploaded media and Cloudinary URLs
        // Priority: imageUrl (Cloudinary) > image (uploaded)
        const imageUrl = slide.imageUrl || slide.image || '';
        let imageSrc = '';
        if (imageUrl) {
            if (imageUrl.startsWith('http')) {
                // Full URL (Cloudinary or external)
                imageSrc = imageUrl;
            } else if (imageUrl.startsWith('/media/uploads/')) {
                // Already has full path
                imageSrc = imageUrl;
            } else {
                // Just filename, add path
                imageSrc = `/media/uploads/${imageUrl}`;
            }
        }
        
        img.src = imageSrc;
        img.alt = slide.alt;
        img.className = `slider-image absolute inset-0 w-full h-full object-cover transition-opacity duration-500`;
        img.style.opacity = index === 0 ? '1' : '0';
        
        // Insert before the overlay div
        const overlay = slider.querySelector('.absolute.inset-0.w-full.h-full.bg-black');
        if (overlay) {
            slider.insertBefore(img, overlay);
        } else {
            slider.appendChild(img);
        }
    });

    // Re-initialize slider if needed
    if (typeof initImageSlider === 'function') {
        initImageSlider();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only load if we're on the projects page
    if (document.querySelector('.projects-page')) {
        // Try to load from CMS, but don't break if it fails
        loadProjects().catch(err => {
            logger.log('CMS data not available, using existing HTML content');
            // Silently fall back to existing HTML - no user action needed
        });
        
        loadComments().catch(err => {
            logger.log('Comments data not available, using existing HTML content');
            // Silently fall back to existing HTML - no user action needed
        });
    }
    
    // Only load slider on index page
    if (document.querySelector('.index-page') || document.querySelector('body.index-page')) {
        loadSlider().catch(err => {
            logger.log('Slider data not available, using existing HTML content');
            // Silently fall back to existing HTML - no user action needed
        });
    }
});

// Re-initialize project tiles after CMS loads
function reinitializeProjectTiles() {
    const tiles = document.querySelectorAll('.project-tile');
    tiles.forEach(tile => {
        // Remove existing listeners and re-attach
        const newTile = tile.cloneNode(true);
        tile.parentNode.replaceChild(newTile, tile);
        
        newTile.addEventListener('click', function() {
            const mediaType = this.getAttribute('data-media-type');
            const mediaSrcs = this.getAttribute('data-media-srcs');
            const youtubeId = this.getAttribute('data-youtube-id');
            if (typeof openModal === 'function') {
                openModal(mediaType, mediaSrcs, youtubeId);
            }
        });
    });
}
