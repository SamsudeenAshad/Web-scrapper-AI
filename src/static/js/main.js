// Shad AI Web Scrapper - Advanced JavaScript by Samsudeen Ashad

class ShadAIScraper {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.selectedType = null;
        this.isProcessing = false;
        this.animationDelay = 100;
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setupAnimations();
        this.setupScrollToTop();
    }

    // Theme Management
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
        
        // Add transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Event Listeners Setup
    setupEventListeners() {
        const scrapeForm = document.getElementById('scrapeForm');
        const scrapeOptions = document.querySelectorAll('.scrape-option');
        
        // Handle scrape option selection with enhanced effects
        scrapeOptions.forEach((option, index) => {
            option.addEventListener('click', () => {
                this.selectOption(option, index);
            });
            
            // Add hover effect
            option.addEventListener('mouseenter', () => {
                this.addHoverEffect(option);
            });
        });

        // Handle form submission
        if (scrapeForm) {
            scrapeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });

            // Handle form reset
            scrapeForm.addEventListener('reset', () => {
                this.resetForm();
            });
        }

        // Handle download and preview buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'downloadBtn' || e.target.closest('#downloadBtn')) {
                this.handleDownload();
            }
            if (e.target.id === 'previewBtn' || e.target.closest('#previewBtn')) {
                this.handlePreview();
            }
        });
    }

    // Enhanced Option Selection
    selectOption(option, index) {
        const scrapeOptions = document.querySelectorAll('.scrape-option');
        
        // Remove selection from all options
        scrapeOptions.forEach(opt => {
            opt.classList.remove('selected');
            opt.style.transform = '';
        });
        
        // Add selection to clicked option with animation
        option.classList.add('selected');
        this.selectedType = option.dataset.type;
        
        // Add selection animation
        option.style.transform = 'scale(1.05) rotateY(5deg)';
        setTimeout(() => {
            option.style.transform = '';
        }, 300);

        // Show selection feedback
        this.showToast(`Selected: ${option.querySelector('h6').textContent}`, 'success');
    }

    // Enhanced Hover Effects
    addHoverEffect(option) {
        if (!option.classList.contains('selected')) {
            option.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }

    // Form Submission Handler
    async handleFormSubmit() {
        const url = document.getElementById('url').value;
        
        if (!this.selectedType) {
            this.showToast('Please select a content type to scrape', 'error');
            this.shakeElement(document.querySelector('.scrape-option').parentElement);
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showToast('Please enter a valid URL', 'error');
            this.shakeElement(document.getElementById('url'));
            return;
        }

        await this.startScraping(url, this.selectedType);
    }

    // URL Validation
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Enhanced Scraping Process
    async startScraping(url, type) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        const startTime = Date.now();
        
        // Show loading with enhanced animation
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

            const result = await response.json();
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);

            if (result.success) {
                this.displayResults(result.data, type, processingTime);
                this.showToast('Scraping completed successfully!', 'success');
            } else {
                throw new Error(result.error || 'Scraping failed');
            }

        } catch (error) {
            console.error('Scraping error:', error);
            this.showError(error.message);
            this.showToast('Scraping failed. Please try again.', 'error');
        } finally {
            this.hideLoadingOverlay();
            this.enableForm();
            this.isProcessing = false;
        }
    }

    // Enhanced Results Display
    displayResults(data, type, processingTime) {
        const resultsSection = document.getElementById('results');
        const resultsContent = document.getElementById('resultsContent');
        
        // Update stats with animation
        this.updateStats(data, processingTime);
        
        // Display content based on type
        if (type === 'images_videos') {
            this.displayMediaContent(data, resultsContent);
        } else if (type === 'content') {
            this.displayTextContent(data, resultsContent);
        } else if (type === 'urls') {
            this.displayUrlContent(data, resultsContent);
        }

        // Show results with staggered animation
        resultsSection.style.display = 'block';
        this.animateResults(resultsSection);
        
        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    }

    // Stats Animation
    updateStats(data, processingTime) {
        const totalItems = document.getElementById('totalItems');
        const processingTimeEl = document.getElementById('processingTime');
        const successRate = document.getElementById('successRate');

        const itemCount = Array.isArray(data) ? data.length : (data.images?.length || 0) + (data.videos?.length || 0);
        
        this.animateCounter(totalItems, 0, itemCount, 1000);
        this.animateCounter(processingTimeEl, 0, parseFloat(processingTime), 1000, 's');
        this.animateCounter(successRate, 0, 95, 1200, '%');
    }

    // Counter Animation
    animateCounter(element, start, end, duration, suffix = '') {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    // Media Content Display
    displayMediaContent(data, container) {
        const { images = [], videos = [] } = data;
        
        container.innerHTML = `
            <div class="row">
                ${images.map((img, index) => `
                    <div class="col-md-6 col-lg-4 mb-4 fade-in" style="animation-delay: ${index * 0.1}s">
                        <div class="preview-item">
                            <img src="${img.src}" alt="${img.alt || 'Scraped image'}" 
                                 class="preview-image w-100" loading="lazy"
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='">
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
                ${videos.map((video, index) => `
                    <div class="col-md-6 col-lg-4 mb-4 fade-in" style="animation-delay: ${(images.length + index) * 0.1}s">
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

    // Text Content Display
    displayTextContent(data, container) {
        container.innerHTML = `
            <div class="content-preview fade-in">
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

    // URL Content Display
    displayUrlContent(data, container) {
        container.innerHTML = `
            <div class="url-list fade-in">
                <div class="mb-3 d-flex justify-content-between align-items-center">
                    <h5><i class="fas fa-link me-2"></i>Extracted URLs</h5>
                    <span class="badge" style="background: var(--gradient-primary); color: white;">
                        ${data.length} links found
                    </span>
                </div>
                ${data.map((url, index) => `
                    <div class="url-item fade-in" style="animation-delay: ${index * 0.05}s">
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
        
        // Make API request
        fetch('/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                type: type
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
            } else {
                showResults(data);
            }
        })
        .catch(error => {
            showError('An error occurred while scraping: ' + error.message);
        })
        .finally(() => {
            // Hide loading indicator and re-enable form
            loadingIndicator.style.display = 'none';
            scrapeForm.style.pointerEvents = 'auto';
            scrapeForm.style.opacity = '1';
        });
    }

    function showResults(data) {
        resultsSection.style.display = 'block';
        errorSection.style.display = 'none';
        
        if (data.type === 'images_videos') {
            showImagesVideosResults(data);
        } else if (data.type === 'content') {
            showContentResults(data);
        } else if (data.type === 'urls') {
            showUrlsResults(data);
        }
    }

    function showImagesVideosResults(data) {
        const images = data.images || [];
        const videos = data.videos || [];
        
        let html = `
            <div class="row mb-3">
                <div class="col-md-6">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${images.length}</div>
                            <div>Images Found</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${videos.length}</div>
                            <div>Videos Found</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Images section
        if (images.length > 0) {
            html += `
                <h5><i class="fas fa-images me-2"></i>Images (${images.length})</h5>
                <div class="row">
            `;
            
            images.forEach((image, index) => {
                html += `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="preview-item p-3">
                            <img src="${image.url}" alt="${image.alt}" class="preview-image mb-2" 
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIExvYWRpbmc8L3RleHQ+PC9zdmc+'">
                            <p class="small text-muted mb-2">${image.alt}</p>
                            <p class="small text-muted mb-2">Size: ${image.width} x ${image.height}</p>
                            <button class="btn btn-success btn-sm download-btn" onclick="downloadItem('image', ${index}, '${image.url}')">
                                <i class="fas fa-download me-1"></i>Download
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }

        // Videos section
        if (videos.length > 0) {
            html += `
                <h5 class="mt-4"><i class="fas fa-video me-2"></i>Videos (${videos.length})</h5>
                <div class="row">
            `;
            
            videos.forEach((video, index) => {
                const videoSrc = video.sources && video.sources.length > 0 ? video.sources[0].url : '';
                const platform = video.platform || '';
                
                html += `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="preview-item p-3">
                `;
                
                if (platform && platform !== 'Unknown') {
                    html += `
                        <div class="embed-responsive embed-responsive-16by9 mb-2">
                            <iframe src="${videoSrc}" class="preview-video" frameborder="0" allowfullscreen></iframe>
                        </div>
                        <p class="small text-muted mb-2">Platform: ${platform}</p>
                    `;
                } else {
                    html += `
                        <video class="preview-video mb-2" controls>
                            <source src="${videoSrc}" type="${video.sources[0].type}">
                            Your browser does not support the video tag.
                        </video>
                    `;
                }
                
                html += `
                            <p class="small text-muted mb-2">Size: ${video.width} x ${video.height}</p>
                            <button class="btn btn-success btn-sm download-btn" onclick="downloadItem('video', ${index}, '${videoSrc}')">
                                <i class="fas fa-download me-1"></i>Download
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }

        if (images.length === 0 && videos.length === 0) {
            html += '<p class="text-muted">No images or videos found on this page.</p>';
        }

        resultsContent.innerHTML = html;
    }

    function showContentResults(data) {
        const content = data.content || {};
        
        let html = `
            <div class="row mb-3">
                <div class="col-md-4">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${content.word_count || 0}</div>
                            <div>Words</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${(content.headings || []).length}</div>
                            <div>Headings</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${(content.paragraphs || []).length}</div>
                            <div>Paragraphs</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5><i class="fas fa-file-alt me-2"></i>Content Preview</h5>
                <button class="btn btn-primary" onclick="downloadContent('${encodeURIComponent(JSON.stringify(content))}')">
                    <i class="fas fa-download me-1"></i>Download as Word Document
                </button>
            </div>
        `;

        // Title
        if (content.title) {
            html += `<h6>Title: ${content.title}</h6>`;
        }

        // Meta description
        if (content.meta_description) {
            html += `<p><strong>Description:</strong> ${content.meta_description}</p>`;
        }

        // Content preview
        html += '<div class="content-preview">';
        
        if (content.headings && content.headings.length > 0) {
            html += '<h6>Headings Structure:</h6><ul>';
            content.headings.forEach(heading => {
                html += `<li>H${heading.level}: ${heading.text}</li>`;
            });
            html += '</ul>';
        }

        if (content.paragraphs && content.paragraphs.length > 0) {
            html += '<h6>Content Sample:</h6>';
            const sampleParagraphs = content.paragraphs.slice(0, 3);
            sampleParagraphs.forEach(paragraph => {
                html += `<p>${paragraph.substring(0, 200)}${paragraph.length > 200 ? '...' : ''}</p>`;
            });
        }

        html += '</div>';

        resultsContent.innerHTML = html;
    }

    function showUrlsResults(data) {
        const urls = data.urls || {};
        const totals = urls.totals || {};
        
        let html = `
            <div class="row mb-3">
                <div class="col-md-2">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${totals.total || 0}</div>
                            <div>Total URLs</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${totals.internal || 0}</div>
                            <div>Internal</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${totals.external || 0}</div>
                            <div>External</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${totals.social || 0}</div>
                            <div>Social</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${totals.email || 0}</div>
                            <div>Email</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <div class="stats-number">${totals.file || 0}</div>
                            <div>Files</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Create tabs for different URL types
        html += `
            <ul class="nav nav-tabs" id="urlTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="internal-tab" data-bs-toggle="tab" data-bs-target="#internal" type="button">
                        Internal Links (${totals.internal || 0})
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="external-tab" data-bs-toggle="tab" data-bs-target="#external" type="button">
                        External Links (${totals.external || 0})
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="social-tab" data-bs-toggle="tab" data-bs-target="#social" type="button">
                        Social Links (${totals.social || 0})
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="files-tab" data-bs-toggle="tab" data-bs-target="#files" type="button">
                        File Links (${totals.file || 0})
                    </button>
                </li>
            </ul>
            
            <div class="tab-content" id="urlTabContent">
                <div class="tab-pane fade show active" id="internal" role="tabpanel">
                    ${generateUrlList(urls.internal_links || [], 'internal')}
                </div>
                <div class="tab-pane fade" id="external" role="tabpanel">
                    ${generateUrlList(urls.external_links || [], 'external')}
                </div>
                <div class="tab-pane fade" id="social" role="tabpanel">
                    ${generateUrlList(urls.social_links || [], 'social')}
                </div>
                <div class="tab-pane fade" id="files" role="tabpanel">
                    ${generateUrlList(urls.file_links || [], 'files')}
                </div>
            </div>
        `;

        resultsContent.innerHTML = html;
    }

    function generateUrlList(links, type) {
        if (links.length === 0) {
            return '<p class="text-muted mt-3">No links found in this category.</p>';
        }

        let html = '<div class="url-list mt-3">';
        
        links.forEach((link, index) => {
            html += `
                <div class="url-item">
                    <div>
                        <a href="${link.url}" target="_blank" class="url-link">${link.text || link.url}</a>
                        ${link.platform ? `<span class="badge bg-info">${link.platform}</span>` : ''}
                        ${link.file_type ? `<span class="badge bg-warning">.${link.file_type}</span>` : ''}
                    </div>
                    <small class="text-muted">${link.url}</small>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    // File Download Handler
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

    // Loading Overlay Management
    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';
        
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.3s ease';
            overlay.style.opacity = '1';
        }, 10);
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.opacity = '0';
        
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }

    // Form State Management
    disableForm() {
        const form = document.getElementById('scrapeForm');
        const buttons = form.querySelectorAll('button, input[type="submit"]');
        
        buttons.forEach(btn => {
            btn.disabled = true;
        });
        
        form.style.opacity = '0.7';
        form.style.pointerEvents = 'none';
    }

    enableForm() {
        const form = document.getElementById('scrapeForm');
        const buttons = form.querySelectorAll('button, input[type="submit"]');
        
        buttons.forEach(btn => {
            btn.disabled = false;
        });
        
        form.style.opacity = '1';
        form.style.pointerEvents = 'auto';
    }

    resetForm() {
        const scrapeOptions = document.querySelectorAll('.scrape-option');
        scrapeOptions.forEach(opt => opt.classList.remove('selected'));
        
        this.selectedType = null;
        document.getElementById('results').style.display = 'none';
        
        this.showToast('Form reset successfully', 'info');
    }

    // Toast Notification System
    showToast(message, type = 'info') {
        // Remove existing toasts
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

        // Add toast styles
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.transform = 'translateX(400px)';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
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

    // Animation Effects
    shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    animateResults(container) {
        const elements = container.querySelectorAll('.fade-in');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Scroll to Top Functionality
    setupScrollToTop() {
        const scrollBtn = document.getElementById('scrollToTop');
        
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

    // Setup Entrance Animations
    setupAnimations() {
        // Add fade-in animation to main elements
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .scale-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateX(0) scale(1)';
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            if (el.classList.contains('slide-in-left')) {
                el.style.transform = 'translateX(-50px)';
            } else if (el.classList.contains('scale-in')) {
                el.style.transform = 'scale(0.8)';
            } else {
                el.style.transform = 'translateY(30px)';
            }
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }

    // Error Display
    showError(message) {
        this.showToast(`Error: ${message}`, 'error');
    }

    // Download Handler
    handleDownload() {
        if (!this.selectedType) {
            this.showToast('No content to download', 'warning');
            return;
        }

        // This would trigger the download based on current results
        this.showToast('Preparing download...', 'info');
        // Implementation depends on the scraped content type
    }

    // Preview Handler
    handlePreview() {
        if (!this.selectedType) {
            this.showToast('No content to preview', 'warning');
            return;
        }

        // Scroll to results if they exist
        const results = document.getElementById('results');
        if (results.style.display !== 'none') {
            results.scrollIntoView({ behavior: 'smooth' });
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

// Initialize the application
const shadScraper = new ShadAIScraper();

// Make it globally accessible for inline event handlers
window.shadScraper = shadScraper;

// Add smooth scrolling to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl + / to toggle theme
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        shadScraper.toggleTheme();
    }
    
    // Escape to close overlays
    if (e.key === 'Escape') {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay.style.display !== 'none') {
            // Don't close loading overlay with escape
            return;
        }
        
        // Close any open toasts
        const toasts = document.querySelectorAll('.toast-notification');
        toasts.forEach(toast => toast.remove());
    }
});

// Add performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart);
        }
    }
});

if ('PerformanceObserver' in window) {
    perfObserver.observe({ entryTypes: ['navigation'] });
}

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here for offline functionality
        console.log('App ready for service worker registration');
    });
}
