// Configuration and constants
export const CONFIG = {
    slideshow: {
        interval: 4000,
        transitionDuration: 600,
        preloadCount: 2
    },
    animations: {
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        easingSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        duration: 300
    },
    gestures: {
        swipeThreshold: 50,
        scrollAmount: 200
    }
};

export const TRANSITIONS = ['fade', 'slide', 'zoom', 'blur'];

export const KEYBOARD_SHORTCUTS = [
    { key: '←', description: 'Previous image' },
    { key: '→', description: 'Next image' },
    { key: 'Space', description: 'Play/Pause' },
    { key: 'K', description: 'Command palette' },
    { key: 'Enter', description: 'Open lightbox' },
    { key: 'Esc', description: 'Close lightbox' },
    { key: 'S', description: 'Shuffle/Unshuffle' },
    { key: 'T', description: 'Cycle transitions' },
    { key: 'F', description: 'Toggle favorite' }
];
