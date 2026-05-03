// Gallery core functionality
import { state } from './state.js';
import { CONFIG } from './config.js';
import { preloadImage, debounce } from './utils.js';

export class Gallery {
    constructor() {
        this.initializeElements();
        this.initializeImages();
        this.setupImagePreloading();
    }

    initializeElements() {
        state.current = document.querySelector('#current');
        this.mainImgContainer = document.querySelector('#main-img');
        this.imageCounter = document.querySelector('#image-counter');
        this.loadingIndicator = document.querySelector('#loading-indicator');
    }

    initializeImages() {
        const imgElements = document.querySelectorAll('.imgs img');
        state.imgs = Array.from(imgElements);
        state.originalOrder = [...state.imgs];
        
        // Add lazy loading attributes
        state.imgs.forEach((img, index) => {
            img.loading = 'lazy';
            img.decoding = 'async';
            img.setAttribute('aria-label', `Gallery thumbnail ${index + 1}`);
            img.setAttribute('data-index', index);
        });
    }

    setupImagePreloading() {
        this.preloadAdjacentImages(0);
        
        // Preload all images in background
        this.preloadAllImagesInBackground();
    }

    preloadAdjacentImages(currentIndex) {
        const { preloadCount } = CONFIG.slideshow;
        const start = Math.max(0, currentIndex - preloadCount);
        const end = Math.min(state.imgs.length - 1, currentIndex + preloadCount);
        
        for (let i = start; i <= end; i++) {
            if (!state.preloaded.has(i)) {
                preloadImage(state.imgs[i].src)
                    .then(() => state.preloaded.add(i))
                    .catch(err => console.error(`Failed to preload image ${i}:`, err));
            }
        }
    }

    preloadAllImagesInBackground() {
        // Use requestIdleCallback for non-blocking preload
        const preloadNext = (index) => {
            if (index >= state.imgs.length) return;
            
            if (!state.preloaded.has(index)) {
                preloadImage(state.imgs[index].src)
                    .then(() => {
                        state.preloaded.add(index);
                        if ('requestIdleCallback' in window) {
                            requestIdleCallback(() => preloadNext(index + 1));
                        } else {
                            setTimeout(() => preloadNext(index + 1), 100);
                        }
                    })
                    .catch(() => preloadNext(index + 1));
            } else {
                preloadNext(index + 1);
            }
        };
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => preloadNext(0));
        } else {
            setTimeout(() => preloadNext(0), 1000);
        }
    }

    async switchImage(index) {
        if (index < 0) index = state.imgs.length - 1;
        if (index >= state.imgs.length) index = 0;
        if (state.isLoading) return;
        
        state.isLoading = true;
        this.showLoading();
        
        state.currentIndex = index;
        const newImage = state.imgs[index];
        
        // Preload adjacent images
        this.preloadAdjacentImages(index);
        
        // Apply transition
        state.current.classList.add('transition-out');
        
        await new Promise(resolve => setTimeout(resolve, CONFIG.animations.duration));
        
        try {
            await preloadImage(newImage.src);
            
            state.current.src = newImage.src;
            state.current.alt = newImage.alt || `Gallery image ${index + 1}`;
            state.current.classList.remove('transition-out');
            state.current.classList.add('transition-in', `transition-${state.transitionMode}`);
            
            this.updateThumbnail(index);
            this.updateImageCounter();
            this.updateFavoriteButton();
            
            state.notify('imageChanged', { index });
            
            setTimeout(() => {
                state.current.classList.remove('transition-in', `transition-${state.transitionMode}`);
            }, CONFIG.animations.duration);
        } catch (error) {
            console.error('Failed to load image:', error);
        } finally {
            this.hideLoading();
            state.isLoading = false;
        }
    }

    updateThumbnail(index) {
        this.clearActiveThumbs();
        
        if (state.imgs[index]) {
            state.imgs[index].setAttribute('aria-current', 'true');
            state.imgs[index].classList.add('active');
            this.scrollThumbnailIntoView(index);
        }
    }

    clearActiveThumbs() {
        state.imgs.forEach(img => {
            img.removeAttribute('aria-current');
            img.classList.remove('active');
        });
    }

    scrollThumbnailIntoView(index) {
        const img = state.imgs[index];
        const container = document.querySelector('.imgs-container');
        
        if (img && container) {
            setTimeout(() => {
                img.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }, 100);
        }
    }

    updateImageCounter() {
        if (this.imageCounter) {
            this.imageCounter.textContent = `${state.currentIndex + 1} / ${state.imgs.length}`;
            this.imageCounter.classList.add('pulse');
            setTimeout(() => this.imageCounter.classList.remove('pulse'), 300);
        }
    }

    updateFavoriteButton() {
        const favoriteBtn = document.querySelector('#favorite-btn');
        if (favoriteBtn) {
            const isFavorite = state.isFavorite(state.currentIndex);
            favoriteBtn.classList.toggle('active', isFavorite);
            favoriteBtn.setAttribute('aria-pressed', isFavorite);
        }
    }

    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.add('active');
        }
    }

    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.remove('active');
        }
    }

    shuffle() {
        state.isShuffled = !state.isShuffled;
        
        if (state.isShuffled) {
            const shuffled = [...state.imgs].sort(() => Math.random() - 0.5);
            state.imgs = shuffled;
        } else {
            state.imgs = [...state.originalOrder];
        }
        
        state.currentIndex = 0;
        state.imgs.forEach((img, idx) => {
            img.setAttribute('data-index', idx);
        });
        
        this.switchImage(0);
        state.notify('shuffleToggled', { isShuffled: state.isShuffled });
    }

    nextImage() {
        const nextIndex = (state.currentIndex + 1) % state.imgs.length;
        this.switchImage(nextIndex);
    }

    previousImage() {
        const prevIndex = (state.currentIndex - 1 + state.imgs.length) % state.imgs.length;
        this.switchImage(prevIndex);
    }

    goToImage(index) {
        if (index >= 0 && index < state.imgs.length) {
            this.switchImage(index);
        }
    }
}
