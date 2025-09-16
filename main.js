const current = document.querySelector('#current');
const imgs = Array.from(document.querySelectorAll('.imgs img'));
const ACTIVE_OPACITY = 0.6;

// make thumbnails keyboard-focusable and clickable
imgs.forEach((img, idx) => {
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', imgClick);
    img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            imgClick({ target: img });
        }
    });
    // set first image as current marker if the main matches
    if (current && img.src && current.src && current.src.endsWith(img.src.split('/').pop())) {
        img.setAttribute('aria-current', 'true');
        img.style.opacity = ACTIVE_OPACITY;
    }
});

function clearActiveThumbs() {
    imgs.forEach(img => {
        img.removeAttribute('aria-current');
        img.style.opacity = 1;
    });
}

function imgClick(e) {
    const clicked = e.target;
    if (!clicked) return;

    clearActiveThumbs();

    // switch the main image
    if (current) {
        // swap src and trigger animation
        current.classList.remove('fade-in');
        // small delay to allow reflow when same image is clicked
        void current.offsetWidth;
        current.src = clicked.src;
        current.classList.add('fade-in');
    }

    // mark clicked thumb
    clicked.setAttribute('aria-current', 'true');
    clicked.style.opacity = ACTIVE_OPACITY;
}
