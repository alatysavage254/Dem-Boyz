// UI components and interactions
import { state } from './state.js';
import { TRANSITIONS, KEYBOARD_SHORTCUTS } from './config.js';
import { debounce } from './utils.js';

export class UI {
    constructor(gallery, slideshow) {
        this.gallery = gallery;
        this.slideshow = slideshow;
        
        this.initializeTheme();
        this.initializeModals();
        this.initializeControls();
        this.initializeCommandPalette();
        this.setupScrollEffects();
    }

    initializeTheme() {
        this.themeToggle = document.querySelector('#theme-toggle');
        this.html = document.documentElement;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.html.classList.add('light-mode');
        }
        this.updateThemeIcon();
        
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.html.classList.toggle('light-mode');
        const theme = this.html.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
        
        // Add transition effect
        this.themeToggle.classList.add('rotating');
        setTimeout(() => this.themeToggle.classList.remove('rotating'), 600);
    }

    updateThemeIcon() {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('.theme-icon');
        if (this.html.classList.contains('light-mode')) {
            icon.textContent = '☀️';
        } else {
            icon.textContent = '🌙';
        }
    }

    initializeModals() {
        this.initializeHelpModal();
        this.initializeLightbox();
    }

    initializeHelpModal() {
        this.helpBtn = document.querySelector('#help-btn');
        this.helpModal = document.querySelector('#help-modal');
        this.helpClose = this.helpModal?.querySelector('.modal-close');
        
        this.helpBtn?.addEventListener('click', () => this.openHelpModal());
        this.helpClose?.addEventListener('click', () => this.closeHelpModal());
        
        this.helpModal?.addEventListener('click', (e) => {
            if (e.target === this.helpModal) {
                this.closeHelpModal();
            }
        });
    }

    openHelpModal() {
        this.helpModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeHelpModal() {
        this.helpModal?.classList.remove('active');
        document.body.style.overflow = '';
    }

    initializeLightbox() {
        this.lightboxModal = document.querySelector('#lightbox-modal');
        this.lightboxImg = document.querySelector('#lightbox-img');
        this.lightboxCounter = document.querySelector('#lightbox-counter');
        this.lightboxClose = this.lightboxModal?.querySelector('.modal-close');
        this.lightboxPrev = document.querySelector('.lightbox-prev');
        this.lightboxNext = document.querySelector('.lightbox-next');
        this.fullscreenBtn = document.querySelector('#fullscreen-btn');
        this.mainImg = document.querySelector('#current');
        
        this.mainImg?.addEventListener('click', () => this.openLightbox());
        this.fullscreenBtn?.addEventListener('click', () => this.openLightbox());
        this.lightboxClose?.addEventListener('click', () => this.closeLightbox());
        this.lightboxPrev?.addEventListener('click', () => this.lightboxNavigate(-1));
        this.lightboxNext?.addEventListener('click', () => this.lightboxNavigate(1));
        
        this.lightboxModal?.addEventListener('click', (e) => {
            if (e.target === this.lightboxModal) {
                this.closeLightbox();
            }
        });
    }

    openLightbox() {
        if (!this.lightboxModal || !this.lightboxImg) return;
        
        this.lightboxImg.src = state.current.src;
        this.lightboxImg.alt = state.current.alt;
        this.lightboxModal.classList.add('active');
        this.updateLightboxCounter();
        document.body.style.overflow = 'hidden';
        
        // Pause slideshow when lightbox opens
        if (state.isPlaying) {
            this.slideshow.stop();
            this.wasPlayingBeforeLightbox = true;
        }
    }

    closeLightbox() {
        if (!this.lightboxModal) return;
        
        this.lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Resume slideshow if it was playing
        if (this.wasPlayingBeforeLightbox) {
            this.slideshow.start();
            this.wasPlayingBeforeLightbox = false;
        }
    }

    lightboxNavigate(direction) {
        const newIndex = (state.currentIndex + direction + state.imgs.length) % state.imgs.length;
        this.gallery.switchImage(newIndex);
        this.lightboxImg.src = state.current.src;
        this.lightboxImg.alt = state.current.alt;
        this.updateLightboxCounter();
    }

    updateLightboxCounter() {
        if (this.lightboxCounter) {
            this.lightboxCounter.textContent = `${state.currentIndex + 1} / ${state.imgs.length}`;
        }
    }

    initializeControls() {
        this.initializeShuffleButton();
        this.initializeTransitionButton();
        this.initializeFavoriteButton();
        this.initializeThumbnailControls();
    }

    initializeShuffleButton() {
        this.shuffleBtn = document.querySelector('#shuffle-btn');
        this.shuffleBtn?.addEventListener('click', () => {
            this.gallery.shuffle();
            this.shuffleBtn.classList.toggle('active', state.isShuffled);
        });
    }

    initializeTransitionButton() {
        this.transitionBtn = document.querySelector('#transition-btn');
        let currentTransitionIndex = 0;
        
        this.transitionBtn?.addEventListener('click', () => {
            currentTransitionIndex = (currentTransitionIndex + 1) % TRANSITIONS.length;
            state.transitionMode = TRANSITIONS[currentTransitionIndex];
            
            this.transitionBtn.classList.add('spinning');
            setTimeout(() => this.transitionBtn.classList.remove('spinning'), 600);
            
            this.showToast(`Transition: ${state.transitionMode}`);
        });
    }

    initializeFavoriteButton() {
        this.favoriteBtn = document.querySelector('#favorite-btn');
        this.favoriteBtn?.addEventListener('click', () => {
            state.toggleFavorite(state.currentIndex);
            this.gallery.updateFavoriteButton();
            
            const isFavorite = state.isFavorite(state.currentIndex);
            this.showToast(isFavorite ? 'Added to favorites' : 'Removed from favorites');
        });
    }

    initializeThumbnailControls() {
        const thumbnailPrev = document.querySelector('.thumbnail-prev');
        const thumbnailNext = document.querySelector('.thumbnail-next');
        const imgContainer = document.querySelector('.imgs-container');
        
        thumbnailPrev?.addEventListener('click', () => {
            imgContainer?.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        });
        
        thumbnailNext?.addEventListener('click', () => {
            imgContainer?.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        });
    }

    initializeCommandPalette() {
        this.commandPalette = document.querySelector('#command-palette');
        this.commandInput = document.querySelector('#command-input');
        this.commandResults = document.querySelector('#command-results');
        
        if (!this.commandPalette) return;
        
        // Close on backdrop click
        this.commandPalette.addEventListener('click', (e) => {
            if (e.target === this.commandPalette) {
                this.closeCommandPalette();
            }
        });
        
        // Search functionality
        this.commandInput?.addEventListener('input', debounce((e) => {
            this.filterCommands(e.target.value);
        }, 150));
    }

    openCommandPalette() {
        if (!this.commandPalette) return;
        
        this.commandPalette.classList.add('active');
        this.commandInput?.focus();
        this.commandInput.value = '';
        this.renderCommands();
        document.body.style.overflow = 'hidden';
    }

    closeCommandPalette() {
        if (!this.commandPalette) return;
        
        this.commandPalette.classList.remove('active');
        document.body.style.overflow = '';
    }

    renderCommands(filter = '') {
        if (!this.commandResults) return;
        
        const commands = [
            { name: 'Toggle Play/Pause', key: 'Space', action: () => this.slideshow.toggle() },
            { name: 'Next Image', key: '→', action: () => this.gallery.nextImage() },
            { name: 'Previous Image', key: '←', action: () => this.gallery.previousImage() },
            { name: 'Toggle Shuffle', key: 'S', action: () => this.gallery.shuffle() },
            { name: 'Cycle Transitions', key: 'T', action: () => this.transitionBtn?.click() },
            { name: 'Toggle Favorite', key: 'F', action: () => state.toggleFavorite(state.currentIndex) },
            { name: 'Open Lightbox', key: 'Enter', action: () => this.openLightbox() },
            { name: 'Toggle Theme', key: '', action: () => this.toggleTheme() }
        ];
        
        const filtered = filter 
            ? commands.filter(cmd => cmd.name.toLowerCase().includes(filter.toLowerCase()))
            : commands;
        
        this.commandResults.innerHTML = filtered.map(cmd => `
            <div class="command-item" data-action="${cmd.name}">
                <span class="command-name">${cmd.name}</span>
                ${cmd.key ? `<kbd class="command-key">${cmd.key}</kbd>` : ''}
            </div>
        `).join('');
        
        // Add click handlers
        this.commandResults.querySelectorAll('.command-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                filtered[index].action();
                this.closeCommandPalette();
            });
        });
    }

    filterCommands(query) {
        this.renderCommands(query);
    }

    setupScrollEffects() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', debounce(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }, 50));
    }

    showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('active'), 10);
        
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}
