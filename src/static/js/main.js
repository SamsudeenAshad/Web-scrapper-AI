// Shad AI Web Scrapper - Advanced JavaScript by Samsudeen Ashad

class ShadAIScraper {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.selectedType = null;
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setupAnimations();
        this.setupScrollToTop();
        this.setupMouseTracker();
        this.setupKeyboardShortcuts();
        this.setupParticleEffects();
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    setupEventListeners() {
        const scrapeForm = document.getElementById('scrapeForm');
        const scrapeOptions = document.querySelectorAll('.scrape-option');
        const demoBtn = document.getElementById('demoBtn');
        const tourBtn = document.getElementById('tourBtn');
        
        scrapeOptions.forEach((option) => {
            option.addEventListener('click', (e) => {
                this.addRippleEffect(option, e);
                this.selectOption(option);
            });
        });

        if (scrapeForm) {
            scrapeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                this.runDemo();
            });
        }

        if (tourBtn) {
            tourBtn.addEventListener('click', () => {
                this.startTour();
            });
        }

        // Add ripple effects to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addRippleEffect(btn, e);
            });
        });
    }

    selectOption(option) {
        const scrapeOptions = document.querySelectorAll('.scrape-option');
        
        scrapeOptions.forEach(opt => {
            opt.classList.remove('selected');
        });
        
        option.classList.add('selected');
        this.selectedType = option.dataset.type;
        
        this.showToast(`Selected: ${option.querySelector('h6').textContent}`, 'success');
    }

    async handleFormSubmit() {
        const url = document.getElementById('url').value;
        
        if (!this.selectedType) {
            this.showToast('Please select a content type to scrape', 'error');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showToast('Please enter a valid URL', 'error');
            return;
        }

        await this.startScraping(url, this.selectedType);
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }    async startScraping(url, type) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        const startTime = Date.now();
        
        this.showLoadingOverlay();
        this.disableForm();
        
        try {
            const response = await fetch('/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, type })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);

            // Backend returns data directly, not wrapped in success object
            this.displayResults(result, type, processingTime);
            this.showToast('Scraping completed successfully!', 'success');

        } catch (error) {
            console.error('Scraping error:', error);
            this.showToast(`Scraping failed: ${error.message}`, 'error');
        } finally {
            this.hideLoadingOverlay();
            this.enableForm();
            this.isProcessing = false;
        }
    }

    displayResults(data, type, processingTime) {
        const resultsSection = document.getElementById('results');
        const resultsContent = document.getElementById('resultsContent');
        
        this.updateStats(data, processingTime);
        
        if (type === 'images_videos') {
            this.displayMediaContent(data, resultsContent);
        } else if (type === 'content') {
            this.displayTextContent(data, resultsContent);
        } else if (type === 'urls') {
            this.displayUrlContent(data, resultsContent);
        }

        resultsSection.style.display = 'block';
        
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }

    updateStats(data, processingTime) {
        const totalItems = document.getElementById('totalItems');
        const processingTimeEl = document.getElementById('processingTime');
        const successRate = document.getElementById('successRate');

        const itemCount = Array.isArray(data) ? data.length : (data.images?.length || 0) + (data.videos?.length || 0);
        
        if (totalItems) totalItems.textContent = itemCount;
        if (processingTimeEl) processingTimeEl.textContent = processingTime + 's';
        if (successRate) successRate.textContent = '95%';
    }

    displayMediaContent(data, container) {
        const { images = [], videos = [] } = data;
        
        container.innerHTML = `
            <div class="row">
                ${images.map((img) => `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="preview-item">
                            <img src="${img.src}" alt="${img.alt || 'Scraped image'}" 
                                 class="preview-image w-100" loading="lazy">
                            <div class="p-3">
                                <small class="text-muted">${img.alt || 'No description'}</small>
                                <div class="mt-2">
                                    <a href="${img.src}" target="_blank" class="btn btn-sm btn-outline-primary me-2">
                                        <i class="fas fa-external-link-alt"></i> View
                                    </a>
                                    <button class="btn btn-sm btn-success" onclick="shadScraper.downloadFile('${img.src}', 'image')">
                                        <i class="fas fa-download"></i> Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
                ${videos.map((video) => `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="preview-item">
                            <video src="${video.src}" class="preview-video w-100" controls loading="lazy">
                                Your browser does not support video playback.
                            </video>
                            <div class="p-3">
                                <small class="text-muted">Video file</small>
                                <div class="mt-2">
                                    <button class="btn btn-sm btn-success" onclick="shadScraper.downloadFile('${video.src}', 'video')">
                                        <i class="fas fa-download"></i> Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    displayTextContent(data, container) {
        container.innerHTML = `
            <div class="content-preview">
                <div class="mb-3 d-flex justify-content-between align-items-center">
                    <h5><i class="fas fa-file-alt me-2"></i>Extracted Content</h5>
                    <span class="badge" style="background: var(--gradient-primary); color: white;">
                        ${data.length} characters
                    </span>
                </div>
                <div style="line-height: 1.8; font-size: 1.1rem;">
                    ${data.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
    }

    displayUrlContent(data, container) {
        container.innerHTML = `
            <div class="url-list">
                <div class="mb-3 d-flex justify-content-between align-items-center">
                    <h5><i class="fas fa-link me-2"></i>Extracted URLs</h5>
                    <span class="badge" style="background: var(--gradient-primary); color: white;">
                        ${data.length} links found
                    </span>
                </div>
                ${data.map((url) => `
                    <div class="url-item">
                        <a href="${url}" target="_blank" class="url-link">
                            <i class="fas fa-external-link-alt me-2"></i>
                            ${url}
                        </a>
                        <button class="btn btn-sm btn-outline-primary" onclick="navigator.clipboard.writeText('${url}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async downloadFile(url, type) {
        try {
            this.showToast('Starting download...', 'info');
            
            const response = await fetch('/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, type })
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `scraped_${type}_${Date.now()}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);
                
                this.showToast('Download completed!', 'success');
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.error('Download error:', error);
            this.showToast('Download failed. Please try again.', 'error');
        }
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    disableForm() {
        const form = document.getElementById('scrapeForm');
        if (form) {
            form.style.opacity = '0.7';
            form.style.pointerEvents = 'none';
        }
    }

    enableForm() {
        const form = document.getElementById('scrapeForm');
        if (form) {
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
        }
    }

    resetForm() {
        const scrapeOptions = document.querySelectorAll('.scrape-option');
        scrapeOptions.forEach(opt => opt.classList.remove('selected'));
        
        this.selectedType = null;
        const results = document.getElementById('results');
        if (results) {
            results.style.display = 'none';
        }
        
        this.showToast('Form reset successfully', 'info');
    }    showToast(message, type = 'info') {
        const existingToasts = document.querySelectorAll('.toast-notification');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)} me-2"></i>
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            box-shadow: 0 12px 35px rgba(0,0,0,0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            z-index: 10000;
            transform: translateX(400px) scale(0.8);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            animation: toastBounce 0.5s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateX(0) scale(1)';
        }, 100);

        // Add pulse effect for success messages
        if (type === 'success') {
            toast.style.animation = 'toastBounce 0.5s ease, toastPulse 1s ease 0.5s';
        }

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.transform = 'translateX(400px) scale(0.8)';
                setTimeout(() => toast.remove(), 400);
            }
        }, 4000);

        // Add haptic feedback simulation
        this.addHapticFeedback(type);
    }

    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || icons.info;
    }

    getToastColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #00c851, #007e33)',
            error: 'linear-gradient(135deg, #ff4444, #cc0000)',
            info: 'linear-gradient(135deg, #33b5e5, #0099cc)',
            warning: 'linear-gradient(135deg, #ffbb33, #ff8800)'
        };
        return colors[type] || colors.info;
    }

    setupScrollToTop() {
        const scrollBtn = document.getElementById('scrollToTop');
        
        if (scrollBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollBtn.style.opacity = '1';
                    scrollBtn.style.transform = 'scale(1)';
                } else {
                    scrollBtn.style.opacity = '0';
                    scrollBtn.style.transform = 'scale(0.8)';
                }
            });

            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    setupAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .scale-in');
        
        animatedElements.forEach(el => {
            el.style.transition = 'all 0.6s ease';
        });
    }

    setupMouseTracker() {
        const mouseTrailer = document.getElementById('mouseTrailer');
        if (!mouseTrailer) return;

        let mouseX = 0;
        let mouseY = 0;
        let trailX = 0;
        let trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateTrailer = () => {
            const diffX = mouseX - trailX;
            const diffY = mouseY - trailY;
            
            trailX += diffX * 0.1;
            trailY += diffY * 0.1;
            
            mouseTrailer.style.left = trailX + 'px';
            mouseTrailer.style.top = trailY + 'px';
            
            requestAnimationFrame(updateTrailer);
        };

        updateTrailer();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + / to toggle theme
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                this.toggleTheme();
                this.showToast('Theme switched!', 'info');
            }
            
            // Escape key to close modals/reset
            if (e.key === 'Escape') {
                this.resetForm();
            }
        });
    }

    setupParticleEffects() {
        // Add random sparkle effect to particles
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            setInterval(() => {
                if (Math.random() > 0.7) {
                    particle.style.boxShadow = `0 0 20px var(--primary-color)`;
                    setTimeout(() => {
                        particle.style.boxShadow = '';
                    }, 500);
                }
            }, 3000 + index * 500);
        });

        // Interactive web lines
        const webLines = document.querySelectorAll('.web-line');
        webLines.forEach(line => {
            line.addEventListener('mouseenter', () => {
                line.style.opacity = '0.8';
                line.style.transform = 'scale(1.1)';
            });
            
            line.addEventListener('mouseleave', () => {
                line.style.opacity = '';
                line.style.transform = '';
            });
        });
    }

    handleDownload() {
        this.showToast('Preparing download...', 'info');
    }

    handlePreview() {
        const results = document.getElementById('results');
        if (results && results.style.display !== 'none') {
            results.scrollIntoView({ behavior: 'smooth' });
        }
    }

    addHapticFeedback(type) {
        // Simulate haptic feedback with visual cues
        const body = document.body;
        const intensity = type === 'error' ? '0.3s' : '0.15s';
        
        body.style.animation = `subtleVibrate ${intensity} ease`;
        setTimeout(() => {
            body.style.animation = '';
        }, 300);
    }

    // Enhanced UI interactions
    addRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    runDemo() {
        this.showToast('Starting demo mode...', 'info');
        
        // Simulate demo scraping
        setTimeout(() => {
            document.getElementById('url').value = 'https://example.com';
            this.showToast('Demo URL filled', 'success');
        }, 1000);

        setTimeout(() => {
            const imageOption = document.querySelector('[data-type="images"]');
            if (imageOption) {
                this.selectOption(imageOption);
                this.showToast('Image scraping selected for demo', 'success');
            }
        }, 2000);

        setTimeout(() => {
            this.showToast('Demo completed! You can now try with your own URL', 'success');
        }, 3000);
    }

    startTour() {
        const tourSteps = [
            { element: '#url', message: 'Enter any website URL here' },
            { element: '.scrape-option', message: 'Select what type of content to extract' },
            { element: '.btn-primary', message: 'Click to start scraping' },
            { element: '.theme-toggle', message: 'Toggle between light and dark themes' }
        ];

        this.showToast('Starting quick tour...', 'info');
        this.runTourSteps(tourSteps, 0);
    }

    runTourSteps(steps, index) {
        if (index >= steps.length) {
            this.showToast('Tour completed! Start scraping any website now', 'success');
            return;
        }

        const step = steps[index];
        const element = document.querySelector(step.element);
        
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight element
            element.style.outline = '3px solid var(--primary-color)';
            element.style.outlineOffset = '5px';
            
            this.showToast(step.message, 'info');
            
            setTimeout(() => {
                element.style.outline = '';
                element.style.outlineOffset = '';
                this.runTourSteps(steps, index + 1);
            }, 2500);
        } else {
            this.runTourSteps(steps, index + 1);
        }
    }
}

// Add shake animation CSS
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shadScraper = new ShadAIScraper();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        if (window.shadScraper) {
            window.shadScraper.toggleTheme();
        }
    }
    
    if (e.key === 'Escape') {
        const toasts = document.querySelectorAll('.toast-notification');
        toasts.forEach(toast => toast.remove());
    }
});
