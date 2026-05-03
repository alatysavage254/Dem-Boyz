// Event handlers
import { state } from './state.js';
import { CONFIG } from './config.js';
import { throttle } from './utils.js';

export class EventHandler {
    constructor(gallery, slideshow, ui) {
        this.gallery = gallery;
        this.slideshow = slideshow;
        this.ui = ui;
        
        this.setupKeyboardEvents();
        this.setupTouchEvents();
        this.setupThumbnailEvents();
        this.setupResizeEvents();
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Don't handle if user is typing in an input
            if (e.target.matches('input, textarea')) return;
            
            // Don't handle if modal is open (except Escape)
            const modalOpen = document.querySelector('.modal.active');
            if (modalOpen && e.key !== 'Escape') return;
            
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    this.gallery.nextImage();
                    this.slideshow.stop();
                    break;
                    
                case 'ArrowLeft':
                    e.preventDefault();
                    this.gallery.previousImage();
                    this.slideshow.stop();
                    break;
                    
                case ' ':
                    e.preventDefault();
                    this.slideshow.toggle();
                    break;
                    
                case 'Enter':
                    if (!modalOpen) {
                        e.preventDefault();
                        this.ui.openLightbox();
                    }
                    break;
                    
                case 'Escape':
                    e.preventDefault();
                    if (this.ui.lightboxModal?.classList.contains('active')) {
                        this.ui.closeLightbox();
                    } else if (this.ui.helpModal?.classList.contains('active')) {
                        this.ui.closeHelpModal();
                    } else if (this.ui.commandPalette?.classList.contains('active')) {
                        this.ui.closeCommandPalette();
                    }
                    break;
                    
                case 's':
                case 'S':
                    if (!modalOpen) {
                        e.preventDefault();
                        this.gallery.shuffle();
                        this.ui.shuffleBtn?.classList.toggle('active', state.isShuffled);
                    }
                    break;
                    
                case 't':
                case 'T':
                    if (!modalOpen) {
                        e.preventDefault();
                        this.ui.transitionBtn?.click();
                    }
                    break;
                    
                case 'f':
                case 'F':
                    if (!modalOpen) {
                        e.preventDefault();
                        state.toggleFavorite(state.currentIndex);
                        this.gallery.updateFavoriteButton();
                    }
                    break;
                    
                case 'k':
                case 'K':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.ui.openCommandPalette();
                    } else if (!modalOpen) {
                        e.preventDefault();
                        this.ui.openCommandPalette();
                    }
                    break;
                    
                case '?':
                    if (!modalOpen) {
                        e.preventDefault();
                        this.ui.openHelpModal();
                    }
                    break;
            }
        });
        
        // Lightbox-specific keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.ui.lightboxModal?.classList.contains('active')) return;
            
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.ui.lightboxNavigate(1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.ui.lightboxNavigate(-1);
            }
        });
    }

    setupTouchEvents() {
        const mainImgContainer = document.querySelector('#main-img');
        if (!mainImgContainer) return;
        
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        
        mainImgContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });
        
        mainImgContainer.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            const timeDiff = touchEndTime - touchStartTime;
            
            // Only register horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > CONFIG.gestures.swipeThreshold) {
                // Prevent accidental swipes during slow drags
                if (timeDiff < 500) {
                    if (diffX > 0) {
                        // Swiped left - next image
                        this.gallery.nextImage();
                    } else {
                        // Swiped right - previous image
                        this.gallery.previousImage();
                    }
                    
                    this.slideshow.stop();
                    
                    // Add haptic feedback if available
                    if ('vibrate' in navigator) {
                        navigator.vibrate(10);
                    }
                }
            }
        }, { passive: true });
        
        // Prevent pull-to-refresh on mobile
        mainImgContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) return; // Allow pinch zoom
            
            const touch = e.touches[0];
            const diffY = touchStartY - touch.clientY;
            
            // Prevent pull-to-refresh when swiping horizontally
            if (Math.abs(touchStartX - touch.clientX) > Math.abs(diffY)) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    setupThumbnailEvents() {
        state.imgs.forEach((img, idx) => {
            img.setAttribute('tabindex', '0');
            
            // Click handler
            img.addEventListener('click', () => {
                this.handleThumbnailClick(idx);
            });
            
            // Keyboard handler
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleThumbnailClick(idx);
                }
            });
            
            // Hover effect with debounce
            img.addEventListener('mouseenter', throttle(() => {
                img.classList.add('hover');
            }, 50));
            
            img.addEventListener('mouseleave', () => {
                img.classList.remove('hover');
            });
        });
    }

    handleThumbnailClick(idx) {
        this.gallery.goToImage(idx);
        this.slideshow.stop();
    }

    setupResizeEvents() {
        const handleResize = throttle(() => {
            // Update any size-dependent calculations
            state.notify('resize');
        }, 250);
        
        window.addEventListener('resize', handleResize);
        
        // Handle orientation change on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                state.notify('orientationChange');
            }, 100);
        });
    }
}
