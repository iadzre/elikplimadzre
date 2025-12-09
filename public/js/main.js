// Optimized Custom Cursor with Performance Improvements
function initCustomCursor() {
    // Better mobile/touch detection
    if (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return;
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isHovering = false;
    let isVisible = false;
    let isAnimating = false;
    let animationId = null;
    let hasMoved = false;
    
    // Track mouse position before cursor is visible
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor on first mouse move
        if (!hasMoved) {
            hasMoved = true;
            cursorX = mouseX;
            cursorY = mouseY;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
            cursor.classList.add('visible');
            isVisible = true;
            startAnimation();
        }
    });
    
    // Track when mouse leaves viewport
    document.addEventListener('mouseleave', () => {
        if (isVisible) {
            cursor.classList.remove('visible');
            isVisible = false;
            stopAnimation();
        }
    });
    
    document.addEventListener('mouseenter', () => {
        if (hasMoved && !isVisible) {
            cursor.classList.add('visible');
            isVisible = true;
            startAnimation();
    }
    });
    
    function startAnimation() {
        if (!isAnimating && isVisible) {
            isAnimating = true;
    animateCursor();
        }
    }
    
    function stopAnimation() {
        isAnimating = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    function animateCursor() {
        if (!isVisible || !isAnimating) {
            stopAnimation();
            return;
        }
        
        // Smooth easing animation
        const easing = prefersReducedMotion ? 1 : 0.4; // Instant for reduced motion
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        animationId = requestAnimationFrame(animateCursor);
    }
    
    // Function to add hover effect
    function addHoverEffect(element) {
        // Skip if element has pointer-events: none
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.pointerEvents === 'none') {
            return;
        }
        
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            isHovering = true;
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            isHovering = false;
        });
    }
    
    // Cached selector for interactive elements
    const interactiveSelector = 'a, button, input, textarea, select, [role="button"], .cursor-pointer, [class*="cursor-pointer"], .project-tile';
    
    // Add hover effect to all interactive elements
    function setupInteractiveElements() {
        const interactiveElements = document.querySelectorAll(interactiveSelector);
        interactiveElements.forEach(el => {
            // Check if already has listeners (simple check)
            if (!el.dataset.cursorListener) {
            addHoverEffect(el);
                el.dataset.cursorListener = 'true';
            }
        });
    }
    
    // Debounced mutation observer callback
    let mutationTimeout;
    function handleMutations() {
        clearTimeout(mutationTimeout);
        mutationTimeout = setTimeout(() => {
    setupInteractiveElements();
        }, 100); // Debounce by 100ms
    }
    
    // Optimized MutationObserver - only watch for added nodes
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        for (const mutation of mutations) {
            // Only process if nodes were added
            if (mutation.addedNodes.length > 0) {
                // Check if any added nodes match our selector
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches(interactiveSelector)) {
                            shouldUpdate = true;
                            break;
                        }
                        // Check children
                        if (node.querySelectorAll && node.querySelectorAll(interactiveSelector).length > 0) {
                            shouldUpdate = true;
                            break;
                        }
                    }
                }
            }
        }
        
        if (shouldUpdate) {
            handleMutations();
        }
    });
    
    // Initial setup
        setupInteractiveElements();
    
    // Observe with optimized options
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopAnimation();
        observer.disconnect();
    });
}

// Initialize cursor when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomCursor);
} else {
    initCustomCursor();
}

const hamburger = document.getElementById('hamburger');
const sidePanel = document.querySelector('.side-panel');
const overlay = document.querySelector('.overlay');
const closeSidePanel = document.getElementById('closeSidePanel');
const mobileNavLinks = document.querySelectorAll('.side-panel nav a');
const desktopNavLinks = document.querySelectorAll('header nav a');
const mainContentBox = document.querySelector('.main-content-box');
const prevButton = document.querySelector('.slide-prev');
const nextButton = document.querySelector('.slide-next');
const socialIcons = document.querySelectorAll('.social-section a');

let closePanelFn = null;

if (hamburger && sidePanel && overlay && closeSidePanel) {
    const applyPanelState = (isOpen) => {
        hamburger.classList.toggle('open', isOpen);
        sidePanel.classList.toggle('open', isOpen);
        overlay.classList.toggle('open', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
    };

    const togglePanel = () => {
        const nextState = !hamburger.classList.contains('open');
        applyPanelState(nextState);
    };

    closePanelFn = () => applyPanelState(false);

    closeSidePanel.addEventListener('click', closePanelFn);
    hamburger.addEventListener('click', togglePanel);
    overlay.addEventListener('click', closePanelFn);
}

// Handle navigation clicks for both mobile and desktop
function handleNavClick(e, links) {
    links.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    
    if (typeof closePanelFn === 'function' && sidePanel && sidePanel.classList.contains('open')) {
        closePanelFn();
    }
}

// Add click event listeners to navigation links
mobileNavLinks.forEach(link => link.addEventListener('click', function(e) {
    handleNavClick(e, mobileNavLinks);
}));

desktopNavLinks.forEach(link => link.addEventListener('click', function(e) {
    handleNavClick(e, desktopNavLinks);
}));

if (mainContentBox && prevButton && nextButton) {
let currentSlide = 0;
const slides = [
    {
        title: "Business Pod",
        image: "images/orange-sofa.png"
    },
    {
        title: "Business Insights",
        image: "images/business-insights.png"
    },
    {
        title: "Success Stories",
        image: "images/success-stories.png"
    }
];

function updateSlide(direction) {
    if (direction === 'next') {
        currentSlide = (currentSlide + 1) % slides.length;
    } else {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }
    
    const contentContainer = mainContentBox.querySelector('.content-container');
        const currentImage = contentContainer.querySelector('.sofa-image');
        
        // Only fade out the image
        currentImage.style.opacity = '0';
    
    setTimeout(() => {
            currentImage.src = slides[currentSlide].image;
            currentImage.alt = slides[currentSlide].title;
            currentImage.style.opacity = '1';
    }, 300);
}

prevButton.addEventListener('click', () => updateSlide('prev'));
nextButton.addEventListener('click', () => updateSlide('next'));
}

socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.querySelector('div').style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.querySelector('div').style.transform = 'scale(1) rotate(0deg)';
    });
});

const suggestionForm = document.querySelector('form[name="suggestion"]');
if (suggestionForm) {
    // Clear error messages function
    function clearErrors() {
        suggestionForm.querySelectorAll('.error').forEach(input => {
            input.classList.remove('error');
        });
        suggestionForm.querySelectorAll('[id$="-error"]').forEach(span => {
            span.classList.add('hidden');
            span.textContent = '';
        });
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
            formMessage.classList.add('hidden');
            formMessage.textContent = '';
        }
    }

    // Show error for a field
    function showError(fieldName, message) {
        const input = suggestionForm.querySelector(`[name="${fieldName}"]`);
        const errorSpan = document.getElementById(`${fieldName}-error`);
        
        if (input) {
            input.classList.add('error');
        }
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.remove('hidden');
        }
    }

    // Show form message
    function showFormMessage(message, isSuccess = false) {
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.classList.remove('hidden');
            formMessage.className = formMessage.className.replace(/text-(red|green|\[#e83685\]|\[#F45D01\])/g, '');
            formMessage.classList.add(isSuccess ? 'text-[#F45D01]' : 'text-[#e83685]');
        }
    }

    suggestionForm.addEventListener('submit', function(e) {
        clearErrors();
        
        const formData = new FormData(this);
        let isValid = true;
        const errors = [];
        
        // Validate each field
        for (let [key, value] of formData.entries()) {
            // Skip hidden fields and honeypot
            if (key === 'form-name' || key === 'bot-field') continue;
            
            if (!value.trim()) {
                isValid = false;
                showError(key, 'This field is required.');
                errors.push(`${key} is required`);
            }
        }
        
        // Email validation
        const email = formData.get('email');
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            isValid = false;
            showError('email', 'Please enter a valid email address.');
        }
        
        if (!isValid) {
            e.preventDefault(); // Only prevent if validation fails
            showFormMessage('Please fill in all required fields correctly.', false);
            // Scroll to first error
            const firstError = suggestionForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return false;
        }
        
        // Show loading state
        const submitButton = suggestionForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'SENDING...';
        }
        
        // If valid, allow the form to submit naturally to Netlify
        // Netlify will handle the submission and redirect
        return true;
    });
}

// Project Modal functionality
const projectModal = document.getElementById('projectModal');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalImageContainer = document.getElementById('modalImageContainer');
const modalVideo = document.getElementById('modalVideo');
const modalVideoSource = document.getElementById('modalVideoSource');
const modalVideoContainer = document.getElementById('modalVideoContainer');
const videoControls = document.getElementById('videoControls');
const videoPlayPause = document.getElementById('videoPlayPause');
const videoSeek = document.getElementById('videoSeek');
const videoTime = document.getElementById('videoTime');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const videoMute = document.getElementById('videoMute');
const videoVolume = document.getElementById('videoVolume');
const volumeIcon = document.getElementById('volumeIcon');
const muteIcon = document.getElementById('muteIcon');
const prevImageBtn = document.getElementById('prevImage');
const nextImageBtn = document.getElementById('nextImage');
const imageCounter = document.getElementById('imageCounter');
const currentImageIndexSpan = document.getElementById('currentImageIndex');
const totalImagesSpan = document.getElementById('totalImages');
const projectTiles = document.querySelectorAll('.project-tile');

let currentImages = [];
let currentImageIndex = 0;
let currentVideos = [];
let currentVideoIndex = 0;
let currentMixedMedia = [];
let currentMixedIndex = 0;
let youtubePlayer = null;
let currentYouTubeId = null;
let currentYouTubeIds = [];
let currentYouTubeIndex = 0;
let youtubeUpdateInterval = null;

// Helper function to determine if a file is a video
function isVideoFile(src) {
    const videoExtensions = ['.mp4', '.MP4', '.mov', '.MOV', '.webm', '.WEBM', '.avi', '.AVI'];
    return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
}

function openModal(mediaType, mediaSrcs, youtubeId = null) {
    if (!projectModal) return;
    
    // Hide all containers initially
    modalImageContainer.classList.add('hidden');
    modalVideoContainer.classList.add('hidden');
    const modalYouTubeContainer = document.getElementById('modalYouTubeContainer');
    if (modalYouTubeContainer) {
        modalYouTubeContainer.classList.add('hidden');
    }
    prevImageBtn.classList.add('hidden');
    nextImageBtn.classList.add('hidden');
    imageCounter.classList.add('hidden');
    
    if (mediaType === 'youtube' && youtubeId) {
        // Handle YouTube video(s) - can be single ID or comma-separated IDs
        if (typeof youtubeId === 'string' && youtubeId.includes(',')) {
            // Multiple videos
            currentYouTubeIds = youtubeId.split(',').map(id => id.trim()).filter(id => id);
            currentYouTubeIndex = 0;
            currentYouTubeId = currentYouTubeIds[0];
            
            // Show navigation if multiple videos
            if (currentYouTubeIds.length > 1) {
                prevImageBtn.classList.remove('hidden');
                nextImageBtn.classList.remove('hidden');
                imageCounter.classList.remove('hidden');
                updateYouTubeCounter();
            }
        } else {
            // Single video
            currentYouTubeIds = [youtubeId];
            currentYouTubeIndex = 0;
            currentYouTubeId = youtubeId;
            prevImageBtn.classList.add('hidden');
            nextImageBtn.classList.add('hidden');
            imageCounter.classList.add('hidden');
        }
        
        if (modalYouTubeContainer) {
            modalYouTubeContainer.classList.remove('hidden');
        }
        initializeYouTubePlayer(currentYouTubeId);
    } else if (mediaType === 'mixed') {
        // Handle mixed media (both images and videos)
        let mediaArray = [];
        if (typeof mediaSrcs === 'string') {
            mediaArray = mediaSrcs.split(',').map(src => src.trim()).filter(src => src);
        } else if (Array.isArray(mediaSrcs)) {
            mediaArray = mediaSrcs;
        } else {
            mediaArray = [mediaSrcs];
        }
        
        // Create array of objects with type and src
        currentMixedMedia = mediaArray.map(src => ({
            src: src,
            type: isVideoFile(src) ? 'video' : 'image'
        }));
        
        currentMixedIndex = 0;
        updateMixedMedia();
        
        // Show navigation if multiple items
        if (currentMixedMedia.length > 1) {
            prevImageBtn.classList.remove('hidden');
            nextImageBtn.classList.remove('hidden');
            imageCounter.classList.remove('hidden');
            updateMixedCounter();
        }
    } else if (mediaType === 'video') {
        // Handle multiple videos - can be a single string or comma-separated string
        if (typeof mediaSrcs === 'string') {
            currentVideos = mediaSrcs.split(',').map(src => src.trim()).filter(src => src);
        } else if (Array.isArray(mediaSrcs)) {
            currentVideos = mediaSrcs;
        } else {
            currentVideos = [mediaSrcs];
        }
        
        currentVideoIndex = 0;
        updateModalVideo();
        modalVideoContainer.classList.remove('hidden');
        
        // Show navigation if multiple videos
        if (currentVideos.length > 1) {
            prevImageBtn.classList.remove('hidden');
            nextImageBtn.classList.remove('hidden');
            // Reuse image counter for video counter
            imageCounter.classList.remove('hidden');
            updateVideoCounter();
        }
    } else {
        // Handle multiple images - can be a single string or comma-separated string
        if (typeof mediaSrcs === 'string') {
            currentImages = mediaSrcs.split(',').map(src => src.trim()).filter(src => src);
        } else if (Array.isArray(mediaSrcs)) {
            currentImages = mediaSrcs;
        } else {
            currentImages = [mediaSrcs];
        }
        
        currentImageIndex = 0;
        updateModalImage();
        modalImageContainer.classList.remove('hidden');
        
        // Show navigation if multiple images
        if (currentImages.length > 1) {
            prevImageBtn.classList.remove('hidden');
            nextImageBtn.classList.remove('hidden');
            imageCounter.classList.remove('hidden');
            updateImageCounter();
        }
    }
    
    projectModal.classList.remove('hidden');
    projectModal.classList.add('show');
    document.body.classList.add('no-scroll');
}

function updateModalImage() {
    if (currentImages.length > 0 && currentImageIndex >= 0 && currentImageIndex < currentImages.length) {
        modalImage.src = currentImages[currentImageIndex];
    }
}

function updateImageCounter() {
    if (currentImageIndexSpan && totalImagesSpan) {
        currentImageIndexSpan.textContent = currentImageIndex + 1;
        totalImagesSpan.textContent = currentImages.length;
    }
}

function updateModalVideo() {
    if (currentVideos.length > 0 && currentVideoIndex >= 0 && currentVideoIndex < currentVideos.length) {
        modalVideoSource.src = currentVideos[currentVideoIndex];
        modalVideo.load();
        updateVideoTime();
        // Reset volume to saved value or default
        if (videoVolume) {
            modalVideo.volume = videoVolume.value / 100;
        }
    }
}

function updateVideoCounter() {
    if (currentImageIndexSpan && totalImagesSpan) {
        currentImageIndexSpan.textContent = currentVideoIndex + 1;
        totalImagesSpan.textContent = currentVideos.length;
    }
}

function updateMixedMedia() {
    if (currentMixedMedia.length > 0 && currentMixedIndex >= 0 && currentMixedIndex < currentMixedMedia.length) {
        const currentItem = currentMixedMedia[currentMixedIndex];
        
        if (currentItem.type === 'video') {
            // Hide image, show video
            modalImageContainer.classList.add('hidden');
            modalVideoContainer.classList.remove('hidden');
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
            modalVideoSource.src = currentItem.src;
            modalVideo.load();
            updateVideoTime();
            // Reset play/pause icons
            if (playIcon && pauseIcon) {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
            // Reset volume
            if (videoVolume) {
                modalVideo.volume = videoVolume.value / 100;
                updateVolumeIcon(modalVideo.volume);
            }
        } else {
            // Hide video, show image
            if (modalVideo) {
                modalVideo.pause();
            }
            modalVideoContainer.classList.add('hidden');
            modalImageContainer.classList.remove('hidden');
            modalImage.src = currentItem.src;
        }
    }
}

function updateMixedCounter() {
    if (currentImageIndexSpan && totalImagesSpan) {
        currentImageIndexSpan.textContent = currentMixedIndex + 1;
        totalImagesSpan.textContent = currentMixedMedia.length;
    }
}

function showNextMixed() {
    if (currentMixedMedia.length > 0) {
        currentMixedIndex = (currentMixedIndex + 1) % currentMixedMedia.length;
        updateMixedMedia();
        updateMixedCounter();
    }
}

function showPrevMixed() {
    if (currentMixedMedia.length > 0) {
        currentMixedIndex = (currentMixedIndex - 1 + currentMixedMedia.length) % currentMixedMedia.length;
        updateMixedMedia();
        updateMixedCounter();
    }
}

function showNextVideo() {
    if (currentVideos.length > 0) {
        currentVideoIndex = (currentVideoIndex + 1) % currentVideos.length;
        updateModalVideo();
        updateVideoCounter();
    }
}

function showPrevVideo() {
    if (currentVideos.length > 0) {
        currentVideoIndex = (currentVideoIndex - 1 + currentVideos.length) % currentVideos.length;
        updateModalVideo();
        updateVideoCounter();
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateVideoTime() {
    if (videoTime && modalVideo) {
        const current = modalVideo.currentTime || 0;
        const duration = modalVideo.duration || 0;
        videoTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    }
}

function updateVideoSeek() {
    if (videoSeek && modalVideo) {
        const current = modalVideo.currentTime || 0;
        const duration = modalVideo.duration || 0;
        if (duration > 0) {
            videoSeek.value = (current / duration) * 100;
        }
    }
}

function showNextImage() {
    if (currentImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateModalImage();
        updateImageCounter();
    }
}

function showPrevImage() {
    if (currentImages.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateModalImage();
        updateImageCounter();
    }
}

function toggleVideoPlayPause() {
    if (!modalVideo) return;
    if (modalVideo.paused) {
        modalVideo.play();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } else {
        modalVideo.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

function closeModalFn() {
    if (!projectModal) return;
    
    // Stop YouTube player if playing
    if (youtubePlayer) {
        try {
            youtubePlayer.stopVideo();
        } catch (e) {
            // Silently handle YouTube player errors
        }
    }
    if (youtubeUpdateInterval) {
        clearInterval(youtubeUpdateInterval);
        youtubeUpdateInterval = null;
    }
    
    projectModal.classList.remove('show');
    setTimeout(() => {
        projectModal.classList.add('hidden');
        modalImage.src = '';
        modalVideoSource.src = '';
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
        currentImages = [];
        currentImageIndex = 0;
        currentVideos = [];
        currentVideoIndex = 0;
        currentMixedMedia = [];
        currentMixedIndex = 0;
        currentYouTubeId = null;
        currentYouTubeIds = [];
        currentYouTubeIndex = 0;
        document.body.classList.remove('no-scroll');
    }, 300);
}

// Add click handlers to project tiles
projectTiles.forEach(tile => {
    tile.addEventListener('click', function() {
        const mediaType = this.getAttribute('data-media-type');
        const mediaSrc = this.getAttribute('data-media-src');
        const mediaSrcs = this.getAttribute('data-media-srcs'); // For multiple images/videos
        const youtubeId = this.getAttribute('data-youtube-id'); // For YouTube videos
        
        if (mediaType === 'youtube' && youtubeId) {
            openModal(mediaType, null, youtubeId);
        } else if (mediaType && (mediaSrc || mediaSrcs)) {
            openModal(mediaType, mediaSrcs || mediaSrc);
        }
    });
});

// Navigation button handlers
if (nextImageBtn) {
    nextImageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const modalYouTubeContainer = document.getElementById('modalYouTubeContainer');
        if (currentYouTubeIds && currentYouTubeIds.length > 1 && modalYouTubeContainer && !modalYouTubeContainer.classList.contains('hidden')) {
            showNextYouTube();
        } else if (currentMixedMedia.length > 0) {
            showNextMixed();
        } else if (!modalVideoContainer.classList.contains('hidden')) {
            showNextVideo();
        } else {
            showNextImage();
        }
    });
}

if (prevImageBtn) {
    prevImageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const modalYouTubeContainer = document.getElementById('modalYouTubeContainer');
        if (currentYouTubeIds && currentYouTubeIds.length > 1 && modalYouTubeContainer && !modalYouTubeContainer.classList.contains('hidden')) {
            showPrevYouTube();
        } else if (currentMixedMedia.length > 0) {
            showPrevMixed();
        } else if (!modalVideoContainer.classList.contains('hidden')) {
            showPrevVideo();
        } else {
            showPrevImage();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (projectModal && projectModal.classList.contains('show')) {
        if (e.key === 'Escape') {
            closeModalFn();
        } else if (e.key === 'ArrowRight') {
            if (currentMixedMedia.length > 1) {
                showNextMixed();
            } else if (!modalVideoContainer.classList.contains('hidden') && currentVideos.length > 1) {
                showNextVideo();
            } else if (currentImages.length > 1) {
                showNextImage();
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentMixedMedia.length > 1) {
                showPrevMixed();
            } else if (!modalVideoContainer.classList.contains('hidden') && currentVideos.length > 1) {
                showPrevVideo();
            } else if (currentImages.length > 1) {
                showPrevImage();
            }
        } else if (e.key === ' ') {
            if ((!modalVideoContainer.classList.contains('hidden') || currentMixedMedia.length > 0) && modalVideo) {
                e.preventDefault();
                toggleVideoPlayPause();
            }
        }
    }
});

// Close modal handlers
if (closeModal) {
    closeModal.addEventListener('click', closeModalFn);
}

// Video control event listeners
if (videoPlayPause && modalVideo) {
    videoPlayPause.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleVideoPlayPause();
    });
}

if (videoSeek && modalVideo) {
    videoSeek.addEventListener('input', function(e) {
        if (modalVideo.duration) {
            modalVideo.currentTime = (e.target.value / 100) * modalVideo.duration;
        }
    });
}

// Volume control event listeners
if (videoMute && modalVideo) {
    videoMute.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleVideoMute();
    });
}

if (videoVolume && modalVideo) {
    videoVolume.addEventListener('input', function(e) {
        const volume = e.target.value / 100;
        modalVideo.volume = volume;
        updateVolumeIcon(volume);
    });
}

function toggleVideoMute() {
    if (!modalVideo) return;
    if (modalVideo.muted) {
        modalVideo.muted = false;
        if (videoVolume) {
            videoVolume.value = modalVideo.volume * 100;
        }
        updateVolumeIcon(modalVideo.volume);
    } else {
        modalVideo.muted = true;
        updateVolumeIcon(0);
    }
}

function updateVolumeIcon(volume) {
    if (!volumeIcon || !muteIcon) return;
    if (volume === 0 || modalVideo.muted) {
        volumeIcon.classList.add('hidden');
        muteIcon.classList.remove('hidden');
    } else {
        volumeIcon.classList.remove('hidden');
        muteIcon.classList.add('hidden');
    }
}

if (modalVideo) {
    // Initialize volume
    if (videoVolume) {
        modalVideo.volume = videoVolume.value / 100;
        updateVolumeIcon(modalVideo.volume);
    }
    
    modalVideo.addEventListener('loadedmetadata', function() {
        updateVideoTime();
        updateVideoSeek();
        // Ensure volume is set
        if (videoVolume) {
            modalVideo.volume = videoVolume.value / 100;
            updateVolumeIcon(modalVideo.volume);
        }
    });
    
    modalVideo.addEventListener('timeupdate', function() {
        updateVideoTime();
        updateVideoSeek();
    });
    
    modalVideo.addEventListener('play', function() {
        if (playIcon && pauseIcon) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        }
    });
    
    modalVideo.addEventListener('pause', function() {
        if (playIcon && pauseIcon) {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    });
    
    modalVideo.addEventListener('ended', function() {
        if (playIcon && pauseIcon) {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    });
}

// Show/hide video controls on hover
if (modalVideoContainer && videoControls) {
    modalVideoContainer.addEventListener('mouseenter', function() {
        videoControls.classList.remove('opacity-0');
        videoControls.classList.add('opacity-100');
    });
    
    modalVideoContainer.addEventListener('mouseleave', function() {
        videoControls.classList.remove('opacity-100');
        videoControls.classList.add('opacity-0');
    });
    
    // Also show controls when video is paused
    if (modalVideo) {
        modalVideo.addEventListener('pause', function() {
            videoControls.classList.remove('opacity-0');
            videoControls.classList.add('opacity-100');
        });
    }
}

// YouTube IFrame API
let youtubeAPIReady = false;

// Make onYouTubeIframeAPIReady globally available
window.onYouTubeIframeAPIReady = function() {
    youtubeAPIReady = true;
};

// Initialize YouTube Player
function initializeYouTubePlayer(videoId) {
    const youtubePlayerDiv = document.getElementById('youtubePlayer');
    if (!youtubePlayerDiv) return;
    
    // Destroy existing player if any
    if (youtubePlayer) {
        try {
            youtubePlayer.destroy();
        } catch (e) {
            // Player might not be initialized
        }
    }
    
    // Wait for API to be ready
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        // Wait for API
        const checkAPI = setInterval(() => {
            if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') {
                clearInterval(checkAPI);
                createYouTubePlayer(videoId);
            }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkAPI);
        }, 5000);
        return;
    }
    
    createYouTubePlayer(videoId);
}

function createYouTubePlayer(videoId) {
    const youtubePlayerDiv = document.getElementById('youtubePlayer');
    if (!youtubePlayerDiv) return;
    
    youtubePlayer = new YT.Player('youtubePlayer', {
        videoId: videoId,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'rel': 0,
            'modestbranding': 1,
            'playsinline': 1
        },
        events: {
            'onReady': onYouTubePlayerReady,
            'onStateChange': onYouTubePlayerStateChange
        }
    });
}

function onYouTubePlayerReady(event) {
    // Player is ready
    setupYouTubeControls();
    updateYouTubeTime();
}

function onYouTubePlayerStateChange(event) {
    const playIcon = document.getElementById('youtubePlayIcon');
    const pauseIcon = document.getElementById('youtubePauseIcon');
    
    if (event.data === YT.PlayerState.PLAYING) {
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
        startYouTubeUpdateInterval();
    } else {
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
        if (youtubeUpdateInterval) {
            clearInterval(youtubeUpdateInterval);
            youtubeUpdateInterval = null;
        }
    }
}

function setupYouTubeControls() {
    const youtubePlayPause = document.getElementById('youtubePlayPause');
    const youtubeSeek = document.getElementById('youtubeSeek');
    const youtubeMute = document.getElementById('youtubeMute');
    const youtubeVolume = document.getElementById('youtubeVolume');
    const youtubeControls = document.getElementById('youtubeControls');
    const modalYouTubeContainer = document.getElementById('modalYouTubeContainer');
    
    if (youtubePlayPause) {
        youtubePlayPause.addEventListener('click', toggleYouTubePlayPause);
    }
    
    if (youtubeSeek) {
        youtubeSeek.addEventListener('input', function(e) {
            if (youtubePlayer) {
                try {
                    const duration = youtubePlayer.getDuration();
                    const seekTo = (e.target.value / 100) * duration;
                    youtubePlayer.seekTo(seekTo, true);
                } catch (err) {
                    // Player might not be ready
                }
            }
        });
    }
    
    if (youtubeMute) {
        youtubeMute.addEventListener('click', toggleYouTubeMute);
    }
    
    if (youtubeVolume) {
        youtubeVolume.addEventListener('input', function(e) {
            if (youtubePlayer) {
                try {
                    const volume = e.target.value;
                    youtubePlayer.setVolume(volume);
                    updateYouTubeVolumeIcon(volume);
                } catch (err) {
                    // Player might not be ready
                }
            }
        });
    }
    
    // Show controls on hover
    if (modalYouTubeContainer && youtubeControls) {
        modalYouTubeContainer.addEventListener('mouseenter', function() {
            youtubeControls.classList.remove('opacity-0');
            youtubeControls.classList.add('opacity-100');
        });
        
        modalYouTubeContainer.addEventListener('mouseleave', function() {
            if (youtubePlayer) {
                try {
                    if (youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
                        youtubeControls.classList.remove('opacity-100');
                        youtubeControls.classList.add('opacity-0');
                    }
                } catch (err) {
                    // Player might not be ready
                }
            }
        });
    }
}

function toggleYouTubePlayPause() {
    if (!youtubePlayer) return;
    
    const playIcon = document.getElementById('youtubePlayIcon');
    const pauseIcon = document.getElementById('youtubePauseIcon');
    
    try {
        if (youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
            youtubePlayer.pauseVideo();
            if (playIcon) playIcon.classList.remove('hidden');
            if (pauseIcon) pauseIcon.classList.add('hidden');
        } else {
            youtubePlayer.playVideo();
            if (playIcon) playIcon.classList.add('hidden');
            if (pauseIcon) pauseIcon.classList.remove('hidden');
        }
    } catch (err) {
        // Player might not be ready
    }
}

function toggleYouTubeMute() {
    if (!youtubePlayer) return;
    
    const volumeIcon = document.getElementById('youtubeVolumeIcon');
    const muteIcon = document.getElementById('youtubeMuteIcon');
    const youtubeVolume = document.getElementById('youtubeVolume');
    
    try {
        if (youtubePlayer.isMuted()) {
            youtubePlayer.unMute();
            if (youtubeVolume) {
                youtubeVolume.value = youtubePlayer.getVolume();
            }
            updateYouTubeVolumeIcon(youtubePlayer.getVolume());
        } else {
            youtubePlayer.mute();
            updateYouTubeVolumeIcon(0);
        }
    } catch (err) {
        // Player might not be ready
    }
}

function updateYouTubeVolumeIcon(volume) {
    const volumeIcon = document.getElementById('youtubeVolumeIcon');
    const muteIcon = document.getElementById('youtubeMuteIcon');
    
    if (!volumeIcon || !muteIcon) return;
    
    if (volume === 0 || (youtubePlayer && youtubePlayer.isMuted())) {
        volumeIcon.classList.add('hidden');
        muteIcon.classList.remove('hidden');
    } else {
        volumeIcon.classList.remove('hidden');
        muteIcon.classList.add('hidden');
    }
}

function updateYouTubeTime() {
    if (!youtubePlayer) return;
    
    const youtubeTime = document.getElementById('youtubeTime');
    const youtubeSeek = document.getElementById('youtubeSeek');
    
    try {
        const current = youtubePlayer.getCurrentTime() || 0;
        const duration = youtubePlayer.getDuration() || 0;
        
        if (youtubeTime) {
            youtubeTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
        }
        
        if (youtubeSeek && duration > 0) {
            youtubeSeek.value = (current / duration) * 100;
        }
    } catch (e) {
        // Player might not be ready
    }
}

function startYouTubeUpdateInterval() {
    if (youtubeUpdateInterval) {
        clearInterval(youtubeUpdateInterval);
    }
    
    youtubeUpdateInterval = setInterval(() => {
        updateYouTubeTime();
    }, 100);
}

function showNextYouTube() {
    if (currentYouTubeIds.length > 0) {
        currentYouTubeIndex = (currentYouTubeIndex + 1) % currentYouTubeIds.length;
        currentYouTubeId = currentYouTubeIds[currentYouTubeIndex];
        
        // Stop current player
        if (youtubePlayer) {
            try {
                youtubePlayer.stopVideo();
                youtubePlayer.destroy();
            } catch (e) {
                // Player might not be initialized
            }
        }
        
        // Initialize new player
        initializeYouTubePlayer(currentYouTubeId);
        updateYouTubeCounter();
    }
}

function showPrevYouTube() {
    if (currentYouTubeIds.length > 0) {
        currentYouTubeIndex = (currentYouTubeIndex - 1 + currentYouTubeIds.length) % currentYouTubeIds.length;
        currentYouTubeId = currentYouTubeIds[currentYouTubeIndex];
        
        // Stop current player
        if (youtubePlayer) {
            try {
                youtubePlayer.stopVideo();
                youtubePlayer.destroy();
            } catch (e) {
                // Player might not be initialized
            }
        }
        
        // Initialize new player
        initializeYouTubePlayer(currentYouTubeId);
        updateYouTubeCounter();
    }
}

function updateYouTubeCounter() {
    if (currentImageIndexSpan && totalImagesSpan && currentYouTubeIds.length > 1) {
        currentImageIndexSpan.textContent = currentYouTubeIndex + 1;
        totalImagesSpan.textContent = currentYouTubeIds.length;
    }
}

if (projectModal) {
    projectModal.addEventListener('click', function(e) {
        if (e.target === projectModal) {
            closeModalFn();
        }
    });
    
    // Close on Escape key, Space for play/pause YouTube, Arrow keys for navigation
    document.addEventListener('keydown', function(e) {
        const modalYouTubeContainer = document.getElementById('modalYouTubeContainer');
        if (e.key === 'Escape' && projectModal.classList.contains('show')) {
            closeModalFn();
        } else if (e.key === ' ' && currentYouTubeId && youtubePlayer) {
            e.preventDefault();
            toggleYouTubePlayPause();
        } else if (e.key === 'ArrowRight' && currentYouTubeIds && currentYouTubeIds.length > 1 && modalYouTubeContainer && !modalYouTubeContainer.classList.contains('hidden')) {
            e.preventDefault();
            showNextYouTube();
        } else if (e.key === 'ArrowLeft' && currentYouTubeIds && currentYouTubeIds.length > 1 && modalYouTubeContainer && !modalYouTubeContainer.classList.contains('hidden')) {
            e.preventDefault();
            showPrevYouTube();
        }
    });
}

// Projects scroll - no infinite loop, just manual scrolling

// Client Comments Carousel
const commentsWrapper = document.querySelector('.client-comments-wrapper');
const commentCards = document.querySelectorAll('.client-comment-card');
const commentIndicators = document.querySelectorAll('.comment-indicator');

if (commentsWrapper && commentCards.length > 0) {
    let currentCommentIndex = 0;
    let autoRotateInterval;
    
    const updateIndicators = (index) => {
        commentIndicators.forEach((indicator, i) => {
            if (i === index) {
                // Active indicator
                indicator.className = 'comment-indicator w-8 h-2 rounded-full bg-[#F45D01] transition-all duration-300';
            } else {
                // Inactive indicator
                indicator.className = 'comment-indicator w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300';
            }
        });
    };
    
    const showComment = (index) => {
        // Update wrapper transform
        commentsWrapper.style.transform = `translateX(-${index * 100}%)`;
        currentCommentIndex = index;
        updateIndicators(index);
    };
    
    // Initialize first comment
    if (commentCards.length > 0) {
        showComment(0);
    }
    
    // Add click handlers to indicators
    commentIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showComment(index);
            // Reset auto-rotate timer
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
                startAutoRotate();
            }
        });
    });
    
    // Auto-rotate comments
    const startAutoRotate = () => {
        autoRotateInterval = setInterval(() => {
            const nextIndex = (currentCommentIndex + 1) % commentCards.length;
            showComment(nextIndex);
        }, 5000); // Change every 5 seconds
    };
    
    // Start auto-rotate
    startAutoRotate();
    
    // Pause on hover
    const commentsSection = document.querySelector('.client-comments-section');
    if (commentsSection) {
        commentsSection.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });
        
        commentsSection.addEventListener('mouseleave', () => {
            startAutoRotate();
        });
    }
}