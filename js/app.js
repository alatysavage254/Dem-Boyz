// Main application entry point
import { Gallery } from './gallery.js';
import { Slideshow } from './slideshow.js';
import { UI } from './ui.js';
import { EventHandler } from './events.js';
import { state } from './state.js';

class App {
    constructor() {
        this.gallery = null;
        this.slideshow = null;
        this.ui = null;
        this.eventHandler = null;
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize core components
            this.gallery = new Gallery();
            this.slideshow = new Slideshow(this.gallery);
            this.ui = new UI(this.gallery, this.slideshow);
            this.eventHandler = new EventHandler(this.gallery, this.slideshow, this.ui);
            
            // Start slideshow
            this.slideshow.start();
            
            // Initial UI update
            this.gallery.updateImageCounter();
            this.gallery.updateFavoriteButton();
            this.ui.updateLightboxCounter();
            
            // Setup state observers
            this.setupStateObservers();
            
            // Add loaded class for animations
            document.body.classList.add('loaded');
            
            // Update copyright year
            this.updateCopyrightYear();
            
            console.log('✨ Gallery initialized successfully');
        } catch (error) {
            console.error('Failed to initialize gallery:', error);
            this.showError('Failed to load gallery. Please refresh the page.');
        }
    }

    setupStateObservers() {
        state.subscribe((event, data) => {
            switch(event) {
                case 'imageChanged':
                    // Restart slideshow progress
                    if (state.isPlaying) {
                        this.slideshow.startProgressAnimation();
                    }
                    break;
                    
                case 'slideshowStarted':
                    this.slideshow.startProgressAnimation();
                    break;
                    
                case 'slideshowStopped':
                    this.slideshow.stopProgressAnimation();
                    break;
                    
                case 'favoriteToggled':
                    console.log('Favorite toggled:', data);
                    break;
                    
                case 'shuffleToggled':
                    console.log('Shuffle toggled:', data.isShuffled);
                    break;
            }
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.classList.add('active');
        }, 10);
    }

    updateCopyrightYear() {
        const yearElement = document.getElementById('copyright-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
}

// Initialize app
const app = new App();
app.init();

// Export for debugging
window.galleryApp = app;
