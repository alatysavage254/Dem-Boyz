// Centralized state management
export class GalleryState {
    constructor() {
        this.current = null;
        this.imgs = [];
        this.currentIndex = 0;
        this.isPlaying = true;
        this.slideshowInterval = null;
        this.isShuffled = false;
        this.originalOrder = [];
        this.transitionMode = 'fade';
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isLoading = false;
        this.preloaded = new Set();
        this.favorites = this.loadFavorites();
        this.observers = [];
    }

    // Observer pattern for state changes
    subscribe(callback) {
        this.observers.push(callback);
    }

    notify(event, data) {
        this.observers.forEach(callback => callback(event, data));
    }

    // Favorites management
    loadFavorites() {
        try {
            const saved = localStorage.getItem('gallery-favorites');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch (e) {
            console.error('Failed to load favorites:', e);
            return new Set();
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('gallery-favorites', JSON.stringify([...this.favorites]));
        } catch (e) {
            console.error('Failed to save favorites:', e);
        }
    }

    toggleFavorite(index) {
        const imgSrc = this.imgs[index]?.src;
        if (!imgSrc) return;

        if (this.favorites.has(imgSrc)) {
            this.favorites.delete(imgSrc);
        } else {
            this.favorites.add(imgSrc);
        }
        this.saveFavorites();
        this.notify('favoriteToggled', { index, isFavorite: this.favorites.has(imgSrc) });
    }

    isFavorite(index) {
        const imgSrc = this.imgs[index]?.src;
        return imgSrc ? this.favorites.has(imgSrc) : false;
    }
}

export const state = new GalleryState();
