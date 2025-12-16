
// Gallery State
const galleryState = {
    current: document.querySelector('#current'),
    imgs: Array.from(document.querySelectorAll('.imgs img')),
    currentIndex: 0,
    isPlaying: true,
    slideshowInterval: null,
    isShuffled: false,
    originalOrder: [],
    transitionMode: 'fade', // fade, slide, zoom, blur
    touchStartX: 0,
    touchStartY: 0,
};

// Preload images
function preloadImages() {
    galleryState.imgs.forEach((img) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
    });
}

// ========================
// THEME TOGGLE (Feature #10)
// ========================
const themeToggle = document.querySelector('#theme-toggle');
const html = document.documentElement;

themeToggle?.addEventListener('click', () => {
    html.classList.toggle('light-mode');
    localStorage.setItem('theme', html.classList.contains('light-mode') ? 'light' : 'dark');
    updateThemeIcon();
});

function updateThemeIcon() {
    if (themeToggle) {
        const icon = themeToggle.querySelector('.theme-icon');
        if (html.classList.contains('light-mode')) {
            icon.textContent = '☀️';
        } else {
            icon.textContent = '🌙';
        }
    }
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    html.classList.add('light-mode');
}
updateThemeIcon();

// ========================
// HELP MODAL (Feature #5)
// ========================
const helpBtn = document.querySelector('#help-btn');
const helpModal = document.querySelector('#help-modal');
const helpClose = helpModal?.querySelector('.modal-close');

helpBtn?.addEventListener('click', () => helpModal?.classList.add('active'));
helpClose?.addEventListener('click', () => helpModal?.classList.remove('active'));

document.addEventListener('keydown', (e) => {
    if (e.key === '?') {
        helpModal?.classList.toggle('active');
    } else if (e.key === 'Escape') {
        helpModal?.classList.remove('active');
    }
});

helpModal?.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        helpModal.classList.remove('active');
    }
});

// ========================
// LIGHTBOX MODAL (Feature #1)
// ========================
const lightboxModal = document.querySelector('#lightbox-modal');
const lightboxImg = document.querySelector('#lightbox-img');
const lightboxCounter = document.querySelector('#lightbox-counter');
const lightboxClose = lightboxModal?.querySelector('.modal-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const fullscreenBtn = document.querySelector('#fullscreen-btn');
const mainImg = document.querySelector('#current');

mainImg?.addEventListener('click', openLightbox);
fullscreenBtn?.addEventListener('click', openLightbox);
lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', () => lightboxNavigate(-1));
lightboxNext?.addEventListener('click', () => lightboxNavigate(1));

function openLightbox() {
    lightboxImg.src = galleryState.current.src;
    lightboxModal?.classList.add('active');
    updateLightboxCounter();
}

function closeLightbox() {
    lightboxModal?.classList.remove('active');
}

function lightboxNavigate(direction) {
    galleryState.currentIndex = (galleryState.currentIndex + direction + galleryState.imgs.length) % galleryState.imgs.length;
    switchImage(galleryState.currentIndex);
    lightboxImg.src = galleryState.current.src;
    updateLightboxCounter();
}

function updateLightboxCounter() {
    if (lightboxCounter) {
        lightboxCounter.textContent = `${galleryState.currentIndex + 1} / ${galleryState.imgs.length}`;
    }
}

lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        closeLightbox();
    }
});

// ========================
// SLIDESHOW FUNCTIONALITY (Feature #1, #6, #8)
// ========================
function initSlideshow() {
    galleryState.originalOrder = [...galleryState.imgs];
    updateThumbnail(0);
    startSlideshow();
    preloadImages();
}

function startSlideshow() {
    if (galleryState.isPlaying) {
        galleryState.slideshowInterval = setInterval(() => {
            galleryState.currentIndex = (galleryState.currentIndex + 1) % galleryState.imgs.length;
            switchImage(galleryState.currentIndex);
        }, 4000);
    }
}

function stopSlideshow() {
    clearInterval(galleryState.slideshowInterval);
}

function switchImage(index) {
    const targetImg = galleryState.imgs[index];
    if (!targetImg) return;

    clearActiveThumbs();

    if (galleryState.current) {
        galleryState.current.classList.remove('fade-in', 'transition-fade', 'transition-slide', 'transition-zoom', 'transition-blur');
        void galleryState.current.offsetWidth;
        galleryState.current.src = targetImg.src;
        galleryState.current.classList.add(`transition-${galleryState.transitionMode}`, 'fade-in');
    }

    updateThumbnail(index);
    updateImageCounter();
    updateLightboxCounter();
}

function updateThumbnail(index) {
    clearActiveThumbs();
    if (galleryState.imgs[index]) {
        galleryState.imgs[index].setAttribute('aria-current', 'true');
        galleryState.imgs[index].style.opacity = 1;
        scrollThumbnailIntoView(index);
    }
}

function clearActiveThumbs() {
    galleryState.imgs.forEach(img => {
        img.removeAttribute('aria-current');
        img.style.opacity = 0.7;
    });
}

// ========================
// IMAGE COUNTER (Feature #2)
// ========================
function updateImageCounter() {
    const counter = document.querySelector('#image-counter');
    if (counter) {
        counter.textContent = `${galleryState.currentIndex + 1} / ${galleryState.imgs.length}`;
    }
}

// ========================
// THUMBNAIL CAROUSEL (Feature #4)
// ========================
const imgContainer = document.querySelector('.imgs-container');
const thumbnailPrev = document.querySelector('.thumbnail-prev');
const thumbnailNext = document.querySelector('.thumbnail-next');
let scrollPosition = 0;

thumbnailPrev?.addEventListener('click', () => scrollThumbnails(-1));
thumbnailNext?.addEventListener('click', () => scrollThumbnails(1));

function scrollThumbnails(direction) {
    if (!imgContainer) return;
    const scrollAmount = 150;
    imgContainer.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

function scrollThumbnailIntoView(index) {
    const img = galleryState.imgs[index];
    if (img && imgContainer) {
        setTimeout(() => {
            img.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }, 100);
    }
}

// ========================
// TRANSITION EFFECTS (Feature #8)
// ========================
const transitionBtn = document.querySelector('#transition-btn');
const transitions = ['fade', 'slide', 'zoom', 'blur'];
let currentTransitionIndex = 0;

transitionBtn?.addEventListener('click', cycleTransition);

function cycleTransition() {
    currentTransitionIndex = (currentTransitionIndex + 1) % transitions.length;
    galleryState.transitionMode = transitions[currentTransitionIndex];
    transitionBtn.style.animation = 'none';
    void transitionBtn.offsetWidth;
    transitionBtn.style.animation = 'spin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
}

// ========================
// SHUFFLE MODE (Feature #7)
// ========================
const shuffleBtn = document.querySelector('#shuffle-btn');
shuffleBtn?.addEventListener('click', toggleShuffle);

function toggleShuffle() {
    galleryState.isShuffled = !galleryState.isShuffled;
    
    if (galleryState.isShuffled) {
        const shuffled = [...galleryState.imgs].sort(() => Math.random() - 0.5);
        galleryState.imgs = shuffled;
        shuffleBtn.classList.add('active');
    } else {
        galleryState.imgs = [...galleryState.originalOrder];
        shuffleBtn.classList.remove('active');
    }
    
    galleryState.currentIndex = 0;
    galleryState.imgs.forEach((img, idx) => {
        img.setAttribute('data-index', idx);
    });
    updateThumbnail(0);
}

// ========================
// THUMBNAIL CLICK HANDLERS
// ========================
galleryState.imgs.forEach((img, idx) => {
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', () => handleThumbnailClick(idx));
    img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleThumbnailClick(idx);
        }
    });
});

function handleThumbnailClick(idx) {
    galleryState.currentIndex = idx;
    switchImage(idx);
    stopSlideshow();
    galleryState.isPlaying = false;
    updatePlayButton();
}

// ========================
// KEYBOARD NAVIGATION
// ========================
document.addEventListener('keydown', (e) => {
    if (e.target.closest('.modal')) return;
    
    if (e.key === 'ArrowRight') {
        galleryState.currentIndex = (galleryState.currentIndex + 1) % galleryState.imgs.length;
        switchImage(galleryState.currentIndex);
        stopSlideshow();
        galleryState.isPlaying = false;
        updatePlayButton();
    } else if (e.key === 'ArrowLeft') {
        galleryState.currentIndex = (galleryState.currentIndex - 1 + galleryState.imgs.length) % galleryState.imgs.length;
        switchImage(galleryState.currentIndex);
        stopSlideshow();
        galleryState.isPlaying = false;
        updatePlayButton();
    } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
    } else if (e.key === 'Enter') {
        openLightbox();
    } else if (e.key === 's' || e.key === 'S') {
        toggleShuffle();
    } else if (e.key === 't' || e.key === 'T') {
        cycleTransition();
    }
});

// ========================
// PLAY/PAUSE FUNCTIONALITY
// ========================
const playPauseBtn = document.querySelector('#play-pause');
playPauseBtn?.addEventListener('click', togglePlayPause);

function togglePlayPause() {
    galleryState.isPlaying = !galleryState.isPlaying;
    updatePlayButton();
    if (galleryState.isPlaying) {
        startSlideshow();
    } else {
        stopSlideshow();
    }
}

function updatePlayButton() {
    if (playPauseBtn) {
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        const playIcon = playPauseBtn.querySelector('.play-icon');
        if (galleryState.isPlaying) {
            pauseIcon.style.display = 'inline';
            playIcon.style.display = 'none';
        } else {
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'inline';
        }
    }
}

// ========================
// TOUCH/SWIPE SUPPORT (Feature #9)
// ========================
const mainImgContainer = document.querySelector('#main-img');

mainImgContainer?.addEventListener('touchstart', (e) => {
    galleryState.touchStartX = e.touches[0].clientX;
    galleryState.touchStartY = e.touches[0].clientY;
});

mainImgContainer?.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = galleryState.touchStartX - touchEndX;
    const diffY = galleryState.touchStartY - touchEndY;
    
    // Only register horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            // Swiped left - next image
            galleryState.currentIndex = (galleryState.currentIndex + 1) % galleryState.imgs.length;
        } else {
            // Swiped right - previous image
            galleryState.currentIndex = (galleryState.currentIndex - 1 + galleryState.imgs.length) % galleryState.imgs.length;
        }
        switchImage(galleryState.currentIndex);
        stopSlideshow();
        galleryState.isPlaying = false;
        updatePlayButton();
    }
});

// ========================
// HOVER FULLSCREEN (Feature #11)
// ========================
mainImgContainer?.addEventListener('mouseenter', () => {
    if (mainImg) {
        mainImg.style.transform = 'scale(1.02)';
    }
});

mainImgContainer?.addEventListener('mouseleave', () => {
    if (mainImg && !mainImg.classList.contains('fade-in')) {
        mainImg.style.transform = 'scale(1)';
    }
});

// ========================
// ANIMATED BACKGROUND (Feature #12)
// ========================
function updateBackgroundBasedOnImage() {
    // Extract average color from current image and update gradient
    // This is a simplified version - full implementation would use canvas
    const currentImageSrc = galleryState.current?.src;
    if (currentImageSrc) {
        // Subtle animation based on image - can be extended
    }
}

// ========================
// INITIALIZATION
// ========================
document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    updateImageCounter();
    updateLightboxCounter();
});

// Add spin animation for transition button
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);