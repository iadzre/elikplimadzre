// about-me.js: JavaScript for About Me page

// Wait for DOM to be ready
(function() {
    'use strict';
    
    // Initialize when DOM is ready
    function init() {
        // Accessibility: Hamburger menu toggle, focus trap, Escape key
        const hamburger = document.getElementById('hamburger');
        const sidePanel = document.getElementById('sidePanel');
        const closeSidePanel = document.getElementById('closeSidePanel');
        let lastFocusedElement = null;
        
        if (!hamburger || !sidePanel || !closeSidePanel) {
            return; // Elements not found, skip initialization
        }
        
        function openSidePanel() {
            if (!sidePanel || !hamburger) return;
            sidePanel.hidden = false;
            sidePanel.setAttribute('aria-hidden', 'false');
            hamburger.setAttribute('aria-expanded', 'true');
            lastFocusedElement = document.activeElement;
            sidePanel.focus();
            document.body.style.overflow = 'hidden';
        }
        
        function closePanel() {
            if (!sidePanel || !hamburger) return;
            sidePanel.hidden = true;
            sidePanel.setAttribute('aria-hidden', 'true');
            hamburger.setAttribute('aria-expanded', 'false');
            if (lastFocusedElement) lastFocusedElement.focus();
            document.body.style.overflow = '';
        }
        
        hamburger.addEventListener('click', openSidePanel);
        closeSidePanel.addEventListener('click', closePanel);
        
        document.addEventListener('keydown', function(e) {
            if (!sidePanel || sidePanel.hidden) return;
            
            if (e.key === 'Escape') {
                closePanel();
            }
            // Focus trap
            if (e.key === 'Tab') {
                const focusableEls = sidePanel.querySelectorAll('a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
                if (focusableEls.length === 0) return;
                
                const firstEl = focusableEls[0];
                const lastEl = focusableEls[focusableEls.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === firstEl) {
                        lastEl.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastEl) {
                        firstEl.focus();
                        e.preventDefault();
                    }
                }
            }
        });
        
        // Timeline scroll indicators
        const timelineScroll = document.getElementById('timeline-scroll');
        const scrollLeftBtn = document.getElementById('timeline-scroll-left');
        const scrollRightBtn = document.getElementById('timeline-scroll-right');

        function updateScrollIndicators() {
            if (!timelineScroll || !scrollLeftBtn || !scrollRightBtn) return;
            
            const { scrollLeft, scrollWidth, clientWidth } = timelineScroll;
            const isAtStart = scrollLeft === 0;
            const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;

            // Show/hide left arrow
            if (isAtStart) {
                scrollLeftBtn.classList.add('opacity-0', 'pointer-events-none');
            } else {
                scrollLeftBtn.classList.remove('opacity-0', 'pointer-events-none');
            }

            // Show/hide right arrow
            if (isAtEnd) {
                scrollRightBtn.classList.add('opacity-0', 'pointer-events-none');
            } else {
                scrollRightBtn.classList.remove('opacity-0', 'pointer-events-none');
            }
        }

        // Scroll functions
        if (scrollLeftBtn && scrollRightBtn && timelineScroll) {
            const getScrollAmount = () => {
                if (window.innerWidth < 640) return 200;
                if (window.innerWidth < 768) return 250;
                return 300;
            };
            
            scrollLeftBtn.addEventListener('click', () => {
                timelineScroll.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });

            scrollRightBtn.addEventListener('click', () => {
                timelineScroll.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });

            // Update indicators on scroll
            timelineScroll.addEventListener('scroll', updateScrollIndicators);
            
            // Update on resize
            window.addEventListener('resize', updateScrollIndicators);
            
            // Initial check
            updateScrollIndicators();
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already ready
        init();
    }
})();

// Software Icons Infinite Loop - Automatic Seamless Animation
(function() {
    'use strict';
    
    // State variables
    let track = null;
    let container = null;
    let position = 0;
    let animationId = null;
    let isPaused = false;
    let setWidth = 0;
    let originalItemCount = 0;
    let isRunning = false;
    let isInitialized = false;
    
    // Constants
    const SPEED = 0.5; // pixels per frame
    const CLONE_SETS = 2; // Number of complete sets to clone
    
    // Get gap value from CSS or fallback
    function getGap() {
        if (!track) {
            const w = window.innerWidth;
            return w >= 1024 ? 64 : w >= 768 ? 48 : 32;
        }
        
        try {
            const style = window.getComputedStyle(track);
            let gap = style.gap || style.columnGap || '0';
            
            if (!gap || gap === 'normal' || gap === '0' || gap === '0px') {
                const w = window.innerWidth;
                return w >= 1024 ? 64 : w >= 768 ? 48 : 32;
            }
            
            const num = parseFloat(gap);
            if (isNaN(num)) {
                const w = window.innerWidth;
                return w >= 1024 ? 64 : w >= 768 ? 48 : 32;
            }
            
            if (gap.includes('rem')) {
                return num * 16;
            } else if (gap.includes('em')) {
                return num * (parseFloat(style.fontSize) || 16);
            }
            
            return num;
        } catch (e) {
            const w = window.innerWidth;
            return w >= 1024 ? 64 : w >= 768 ? 48 : 32;
        }
    }
    
    // Calculate width of one complete set
    function calculateSetWidth() {
        if (!track || originalItemCount === 0) return 0;
        
        const gap = getGap();
            let totalWidth = 0;
        let itemCount = 0;
        
        // Calculate width of original items only (before any clones)
        const itemsToCheck = Math.min(originalItemCount, track.children.length);
        
        for (let i = 0; i < itemsToCheck; i++) {
            const item = track.children[i];
                if (item) {
                const rect = item.getBoundingClientRect();
                const width = rect.width || item.offsetWidth || 0;
                
                if (width > 0) {
                    totalWidth += width;
                    itemCount++;
                    
                    // Add gap after each item except the last
                    if (i < itemsToCheck - 1) {
                        totalWidth += gap;
                    }
                }
            }
        }
        
        return itemCount > 0 ? totalWidth : 0;
    }
    
    // Clone items for seamless loop
    function cloneItems() {
        if (!track || originalItemCount === 0) return;
        
        // Remove existing clones first
        while (track.children.length > originalItemCount) {
            track.removeChild(track.lastChild);
        }
        
        // Clone complete sets
        for (let set = 0; set < CLONE_SETS; set++) {
            for (let i = 0; i < originalItemCount; i++) {
                const item = track.children[i];
                if (item) {
                        const clone = item.cloneNode(true);
                    track.appendChild(clone);
                }
            }
        }
    }
    
    // Animation function
    function animate() {
        if (!track || setWidth <= 0) {
            animationId = null;
            isRunning = false;
            return;
        }
        
        if (!isPaused) {
            position -= SPEED;
            
            // Reset position when we've scrolled one full set width
            if (Math.abs(position) >= setWidth) {
                position += setWidth;
            }
            
            track.style.transform = `translateX(${position}px)`;
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    function startAnimation() {
        if (!isRunning && setWidth > 0 && track && !isPaused) {
            isRunning = true;
            animate();
        }
    }
    
    // Stop animation
    function stopAnimation() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        isRunning = false;
    }
    
    // Initialize slider
    function init() {
        // Get elements
        track = document.getElementById('software-slider-track');
        container = document.getElementById('software-slider');
        
        if (!track || !container) {
            return;
        }
        
        // Stop any running animation
        stopAnimation();
        
        // Reset original item count if needed (only count non-cloned items)
        // Remove any existing clones first
        const currentChildren = track.children.length;
        if (currentChildren > 0) {
            // If we have more items than expected, remove clones
            if (originalItemCount > 0 && currentChildren > originalItemCount) {
                while (track.children.length > originalItemCount) {
                    track.removeChild(track.lastChild);
                }
            } else if (originalItemCount === 0) {
                // First time: count original items
                originalItemCount = currentChildren;
            }
        }
        
        if (originalItemCount === 0) {
            return;
        }
        
        // Ensure track has proper styling
        track.style.display = 'flex';
        track.style.willChange = 'transform';
        track.style.transition = 'none';
        
        // Reset position
        position = 0;
        track.style.transform = 'translateX(0)';
        
        // Wait for layout, then calculate and setup
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Force a reflow to ensure layout is complete
                void track.offsetHeight;
                
                // Calculate set width
                setWidth = calculateSetWidth();
                
                if (setWidth > 50) { // Minimum width check
                    // Clone items for seamless loop
                    cloneItems();
                    
                    // Wait one more frame after cloning to ensure layout
                    requestAnimationFrame(() => {
                        // Force another reflow after cloning
                        void track.offsetHeight;
                        
                        // Recalculate to be sure
                        const recalculatedWidth = calculateSetWidth();
                        if (recalculatedWidth > 50) {
                            setWidth = recalculatedWidth;
                        }
                        
                        // Start animation
                        isInitialized = true;
                        startAnimation();
                    });
                } else {
                    // Retry if width calculation failed
                    setTimeout(() => {
                        if (!isInitialized) {
                            init();
                        }
                    }, 500);
                }
            });
        });
    }
    
    // Start initialization
    function start() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 100);
            });
        } else {
            setTimeout(init, 100);
        }
    }
    
    // Begin initialization
    start();
    
    // Re-initialize after all assets load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!isInitialized) {
                originalItemCount = 0;
                isInitialized = false;
                init();
            }
        }, 300);
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            stopAnimation();
            originalItemCount = 0;
            isInitialized = false;
            init();
        }, 300);
    });
    
    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        isPaused = document.hidden;
        if (!isPaused && isInitialized && setWidth > 0) {
            // Resume animation if it was running
            if (!isRunning) {
                startAnimation();
            }
        }
    });
    
    // Respect reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
        isPaused = true;
    }
    reducedMotion.addEventListener('change', (e) => {
        isPaused = e.matches;
        if (!isPaused && isInitialized && setWidth > 0 && !isRunning) {
            startAnimation();
        }
    });
})();

// Header blur on scroll up
let lastScrollTop = 0;
const header = document.getElementById('mainHeader');

if (header) {
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            // Scrolling down
            header.classList.remove('header-blur');
        } else if (scrollTop < lastScrollTop && scrollTop > 50) {
            // Scrolling up
            header.classList.add('header-blur');
        } else if (scrollTop <= 50) {
            // At top of page
            header.classList.remove('header-blur');
        }
        
        lastScrollTop = scrollTop;
    });
}
