// Slideshow controller
import { state } from './state.js';
import { CONFIG } from './config.js';

export class Slideshow {
    constructor(gallery) {
        this.gallery = gallery;
        this.playPauseBtn = document.querySelector('#play-pause');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressStartTime = null;
        this.animationFrameId = null;
        
        this.setupControls();
    }

    setupControls() {
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => this.toggle());
        }
    }

    start() {
        if (state.isPlaying) return;
        
        state.isPlaying = true;
        this.updatePlayButton();
        this.scheduleNext();
        this.startProgressAnimation();
        state.notify('slideshowStarted');
    }

    stop() {
        if (!state.isPlaying) return;
        
        state.isPlaying = false;
        this.updatePlayButton();
        this.clearSchedule();
        this.stopProgressAnimation();
        state.notify('slideshowStopped');
    }

    toggle() {
        if (state.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }

    scheduleNext() {
        this.clearSchedule();
        
        if (state.isPlaying) {
            state.slideshowInterval = setTimeout(() => {
                this.gallery.nextImage();
                this.scheduleNext();
            }, CONFIG.slideshow.interval);
        }
    }

    clearSchedule() {
        if (state.slideshowInterval) {
            clearTimeout(state.slideshowInterval);
            state.slideshowInterval = null;
        }
    }

    startProgressAnimation() {
        this.progressStartTime = performance.now();
        this.animateProgress();
    }

    stopProgressAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
        }
    }

    animateProgress() {
        if (!state.isPlaying || !this.progressBar) return;
        
        const elapsed = performance.now() - this.progressStartTime;
        const progress = Math.min((elapsed / CONFIG.slideshow.interval) * 100, 100);
        
        this.progressBar.style.width = `${progress}%`;
        
        if (progress < 100) {
            this.animationFrameId = requestAnimationFrame(() => this.animateProgress());
        } else {
            this.progressStartTime = performance.now();
            this.animateProgress();
        }
    }

    updatePlayButton() {
        if (!this.playPauseBtn) return;
        
        const pauseIcon = this.playPauseBtn.querySelector('.pause-icon');
        const playIcon = this.playPauseBtn.querySelector('.play-icon');
        
        if (state.isPlaying) {
            pauseIcon?.style.setProperty('display', 'inline');
            playIcon?.style.setProperty('display', 'none');
            this.playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
        } else {
            pauseIcon?.style.setProperty('display', 'none');
            playIcon?.style.setProperty('display', 'inline');
            this.playPauseBtn.setAttribute('aria-label', 'Play slideshow');
        }
    }

    restart() {
        this.stop();
        this.start();
    }
}
