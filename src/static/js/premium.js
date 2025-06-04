// Premium Features JavaScript for Shad AI Web Scrapper
// Advanced functionality for premium users

class PremiumScraper {
    constructor() {
        this.selectedType = null;
        this.isProcessing = false;
        this.premiumFeatures = {
            aiEnhancement: true,
            deepScan: false,
            autoQuality: true,
            cloudBackup: false
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPremiumAnimations();
        this.setupAdvancedFeatures();
        this.loadPremiumSettings();
    }

    setupEventListeners() {
        // Premium form submission
        const premiumForm = document.getElementById('premiumScrapeForm');
        if (premiumForm) {
            premiumForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePremiumSubmit();
            });
        }

        // Premium option selection
        const premiumOptions = document.querySelectorAll('.premium-option');
        premiumOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.addPremiumRipple(option, e);
                this.selectPremiumOption(option);
            });
        });

        // Premium settings toggles
        const premiumSwitches = document.querySelectorAll('.premium-switch input');
        premiumSwitches.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.updatePremiumSetting(e.target.id, e.target.checked);
            });
        });

        // Upgrade button
        const upgradeBtn = document.getElementById('upgradeBtn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
                this.showUpgradeModal();
            });
        }

        // Premium action buttons
        this.setupPremiumActionButtons();
    }

    setupPremiumActionButtons() {
        const premiumPreviewBtn = document.getElementById('premiumPreviewBtn');
        const premiumDownloadBtn = document.getElementById('premiumDownloadBtn');
        const premiumCloudBtn = document.getElementById('premiumCloudBtn');

        if (premiumPreviewBtn) {
            premiumPreviewBtn.addEventListener('click', () => {
                this.showPremiumPreview();
            });
        }

        if (premiumDownloadBtn) {
            premiumDownloadBtn.addEventListener('click', () => {
                this.startBulkDownload();
            });
        }

        if (premiumCloudBtn) {
            premiumCloudBtn.addEventListener('click', () => {
                this.saveToCloud();
            });
        }
    }

    selectPremiumOption(selectedOption) {
        // Remove selection from all options
        document.querySelectorAll('.premium-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked option
        selectedOption.classList.add('selected');
        this.selectedType = selectedOption.dataset.type;

        // Add premium selection animation
        this.animatePremiumSelection(selectedOption);

        this.showPremiumToast(`Premium ${this.getTypeDisplayName(this.selectedType)} selected!`, 'success');
    }

    getTypeDisplayName(type) {
        const typeNames = {
            premium_images: 'Images',
            premium_videos: 'Videos',
            bulk_download: 'Bulk Download'
        };
        return typeNames[type] || type;
    }

    handlePremiumSubmit() {
        if (this.isProcessing) return;

        const url = document.getElementById('premiumUrl').value;
        if (!url || !this.selectedType) {
            this.showPremiumToast('Please enter a URL and select a premium content type', 'error');
            return;
        }

        this.isProcessing = true;
        this.showPremiumLoading();
        this.startPremiumScraping(url, this.selectedType);
    }

    async startPremiumScraping(url, type) {
        try {
            const startTime = Date.now();
            
            // Simulate premium processing with enhanced features
            await this.simulatePremiumProcessing();

            const response = await fetch('/premium-scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    type: type,
                    settings: this.premiumFeatures
                })
            });

            if (!response.ok) {
                // Fallback to demo mode for premium features
                await this.runPremiumDemo(url, type);
                return;
            }

            const data = await response.json();
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);
            
            this.hidePremiumLoading();
            this.displayPremiumResults(data, processingTime);
            
        } catch (error) {
            console.log('Using premium demo mode...');
            await this.runPremiumDemo(url, type);
        } finally {
            this.isProcessing = false;
        }
    }

    async runPremiumDemo(url, type) {
        try {
            const startTime = Date.now();
            
            // Generate premium demo data
            const demoData = this.generatePremiumDemoData(type);
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);
            
            this.hidePremiumLoading();
            this.displayPremiumResults(demoData, processingTime);
            
            this.showPremiumToast('Premium demo completed! Upgrade to access real premium features.', 'info');
            
        } catch (error) {
            this.hidePremiumLoading();
            this.showPremiumToast('Premium processing failed. Please try again.', 'error');
        }
    }

    generatePremiumDemoData(type) {
        const baseData = {
            timestamp: new Date().toISOString(),
            premium: true,
            success_rate: 99.8,
            quality: '4K',
            ai_enhanced: true
        };

        switch (type) {
            case 'premium_images':
                return {
                    ...baseData,
                    images: this.generatePremiumImageData(),
                    metadata: {
                        total_count: 247,
                        high_res_count: 189,
                        ai_enhanced_count: 156,
                        formats: ['JPEG', 'PNG', 'WebP', 'HEIC']
                    }
                };
                
            case 'premium_videos':
                return {
                    ...baseData,
                    videos: this.generatePremiumVideoData(),
                    metadata: {
                        total_count: 43,
                        hd_count: 32,
                        ultra_hd_count: 11,
                        formats: ['MP4', 'WebM', 'AVI', 'MOV']
                    }
                };
                
            case 'bulk_download':
                return {
                    ...baseData,
                    bulk: this.generateBulkDownloadData(),
                    metadata: {
                        total_items: 1247,
                        total_size: '2.4 GB',
                        compression_ratio: '73%',
                        estimated_download: '2m 34s'
                    }
                };
                
            default:
                return baseData;
        }
    }

    generatePremiumImageData() {
        const premiumImages = [];
        const sampleImages = [
            'https://picsum.photos/800/600?random=1',
            'https://picsum.photos/1200/900?random=2',
            'https://picsum.photos/1920/1080?random=3',
            'https://picsum.photos/1600/1200?random=4',
            'https://picsum.photos/2560/1440?random=5',
            'https://picsum.photos/3840/2160?random=6'
        ];

        for (let i = 0; i < 12; i++) {
            premiumImages.push({
                url: sampleImages[i % sampleImages.length],
                filename: `premium_image_${i + 1}_4K.jpg`,
                size: `${(Math.random() * 5 + 2).toFixed(1)} MB`,
                resolution: ['4K UHD', '2K QHD', 'Full HD', '8K Ultra'][Math.floor(Math.random() * 4)],
                quality: Math.floor(Math.random() * 20) + 80,
                ai_enhanced: Math.random() > 0.3,
                metadata: {
                    camera: 'Canon EOS R5',
                    lens: '24-70mm f/2.8',
                    iso: Math.floor(Math.random() * 1600) + 100,
                    aperture: `f/${(Math.random() * 4 + 1.4).toFixed(1)}`
                }
            });
        }

        return premiumImages;
    }

    generatePremiumVideoData() {
        const premiumVideos = [];
        const sampleThumbnails = [
            'https://picsum.photos/640/360?random=10',
            'https://picsum.photos/640/360?random=11',
            'https://picsum.photos/640/360?random=12',
            'https://picsum.photos/640/360?random=13',
            'https://picsum.photos/640/360?random=14',
            'https://picsum.photos/640/360?random=15'
        ];

        for (let i = 0; i < 8; i++) {
            premiumVideos.push({
                url: `https://example.com/premium_video_${i + 1}.mp4`,
                thumbnail: sampleThumbnails[i % sampleThumbnails.length],
                filename: `premium_video_${i + 1}_4K.mp4`,
                size: `${(Math.random() * 500 + 100).toFixed(1)} MB`,
                duration: `${Math.floor(Math.random() * 10) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
                resolution: ['4K UHD (3840x2160)', '2K QHD (2560x1440)', 'Full HD (1920x1080)'][Math.floor(Math.random() * 3)],
                fps: [24, 30, 60, 120][Math.floor(Math.random() * 4)],
                codec: ['H.264', 'H.265', 'VP9', 'AV1'][Math.floor(Math.random() * 4)],
                quality: Math.floor(Math.random() * 20) + 80
            });
        }

        return premiumVideos;
    }

    generateBulkDownloadData() {
        return {
            categories: {
                images: { count: 847, size: '1.2 GB' },
                videos: { count: 156, size: '890 MB' },
                documents: { count: 234, size: '145 MB' },
                audio: { count: 78, size: '234 MB' }
            },
            compression: {
                original_size: '2.87 GB',
                compressed_size: '2.4 GB',
                savings: '470 MB'
            },
            estimated_time: '2m 34s',
            servers: ['US East', 'EU West', 'Asia Pacific'],
            priority: 'High Speed'
        };
    }

    displayPremiumResults(data, processingTime) {
        const resultsDiv = document.getElementById('premiumResults');
        const contentDiv = document.getElementById('premiumResultsContent');
        
        if (!resultsDiv || !contentDiv) return;

        // Update premium stats
        this.updatePremiumStats(data, processingTime);

        // Display content based on type
        if (data.images) {
            this.displayPremiumImages(data.images, contentDiv);
        } else if (data.videos) {
            this.displayPremiumVideos(data.videos, contentDiv);
        } else if (data.bulk) {
            this.displayBulkDownloadResults(data.bulk, contentDiv);
        }

        // Show results with premium animation
        resultsDiv.style.display = 'block';
        this.animatePremiumResults();
    }

    updatePremiumStats(data, processingTime) {
        const totalItems = document.getElementById('premiumTotalItems');
        const timeElement = document.getElementById('premiumProcessingTime');
        const qualityElement = document.getElementById('premiumQuality');
        const successElement = document.getElementById('premiumSuccess');

        if (totalItems) {
            const count = data.metadata?.total_count || data.images?.length || data.videos?.length || 0;
            this.animateNumber(totalItems, 0, count, 1000);
        }

        if (timeElement) {
            timeElement.textContent = processingTime + 's';
        }

        if (qualityElement) {
            qualityElement.textContent = data.quality || '4K';
        }

        if (successElement) {
            successElement.textContent = (data.success_rate || 99) + '%';
        }
    }

    displayPremiumImages(images, container) {
        const grid = document.createElement('div');
        grid.className = 'row g-3 premium-image-grid';

        images.forEach((image, index) => {
            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-4 col-sm-6';
            
            col.innerHTML = `
                <div class="card premium-image-card" style="animation-delay: ${index * 0.1}s">
                    <div class="premium-image-container">
                        <img src="${image.url}" class="card-img-top premium-image" alt="Premium Image ${index + 1}">
                        <div class="premium-image-overlay">
                            <div class="premium-image-actions">
                                <button class="btn btn-sm btn-premium" onclick="premiumScraper.viewPremiumImage('${image.url}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-premium" onclick="premiumScraper.downloadPremiumImage('${image.url}', '${image.filename}')">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                            <div class="premium-image-quality">
                                <span class="quality-badge">${image.resolution}</span>
                                ${image.ai_enhanced ? '<span class="ai-badge"><i class="fas fa-brain"></i> AI</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">${image.filename}</h6>
                        <div class="premium-image-meta">
                            <small class="text-muted">
                                <i class="fas fa-hdd me-1"></i>${image.size} • 
                                <i class="fas fa-star me-1"></i>${image.quality}% Quality
                            </small>
                        </div>
                    </div>
                </div>
            `;
            
            grid.appendChild(col);
        });

        container.innerHTML = '';
        container.appendChild(grid);
    }

    displayPremiumVideos(videos, container) {
        const grid = document.createElement('div');
        grid.className = 'row g-3 premium-video-grid';

        videos.forEach((video, index) => {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6';
            
            col.innerHTML = `
                <div class="card premium-video-card" style="animation-delay: ${index * 0.1}s">
                    <div class="premium-video-container">
                        <img src="${video.thumbnail}" class="card-img-top premium-video-thumbnail" alt="Video Thumbnail">
                        <div class="premium-video-overlay">
                            <div class="premium-video-play">
                                <i class="fas fa-play-circle fa-3x"></i>
                            </div>
                            <div class="premium-video-actions">
                                <button class="btn btn-sm btn-premium" onclick="premiumScraper.playPremiumVideo('${video.url}')">
                                    <i class="fas fa-play"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-premium" onclick="premiumScraper.downloadPremiumVideo('${video.url}', '${video.filename}')">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                            <div class="premium-video-quality">
                                <span class="quality-badge">${video.resolution}</span>
                                <span class="fps-badge">${video.fps}fps</span>
                            </div>
                        </div>
                        <div class="premium-video-duration">
                            <span>${video.duration}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">${video.filename}</h6>
                        <div class="premium-video-meta">
                            <small class="text-muted">
                                <i class="fas fa-hdd me-1"></i>${video.size} • 
                                <i class="fas fa-video me-1"></i>${video.codec} • 
                                <i class="fas fa-star me-1"></i>${video.quality}%
                            </small>
                        </div>
                    </div>
                </div>
            `;
            
            grid.appendChild(col);
        });

        container.innerHTML = '';
        container.appendChild(grid);
    }

    displayBulkDownloadResults(bulk, container) {
        container.innerHTML = `
            <div class="premium-bulk-results">
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="premium-bulk-summary">
                            <h5><i class="fas fa-chart-pie me-2"></i>Download Summary</h5>
                            <div class="bulk-categories">
                                ${Object.entries(bulk.categories).map(([type, data]) => `
                                    <div class="bulk-category">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="category-name">
                                                <i class="fas fa-${this.getCategoryIcon(type)} me-2"></i>
                                                ${type.charAt(0).toUpperCase() + type.slice(1)}
                                            </span>
                                            <span class="category-stats">
                                                <span class="count">${data.count}</span> • 
                                                <span class="size">${data.size}</span>
                                            </span>
                                        </div>
                                        <div class="category-progress">
                                            <div class="progress">
                                                <div class="progress-bar bg-premium" style="width: ${Math.random() * 40 + 60}%"></div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="premium-bulk-actions">
                            <h5><i class="fas fa-rocket me-2"></i>Bulk Actions</h5>
                            <div class="bulk-action-buttons">
                                <button class="btn btn-premium w-100 mb-3" onclick="premiumScraper.startBulkDownload()">
                                    <i class="fas fa-download me-2"></i>
                                    Download All (${bulk.compression.compressed_size})
                                </button>
                                <button class="btn btn-outline-premium w-100 mb-3" onclick="premiumScraper.createCustomArchive()">
                                    <i class="fas fa-archive me-2"></i>
                                    Create Custom Archive
                                </button>
                                <button class="btn btn-outline-premium w-100" onclick="premiumScraper.scheduleDownload()">
                                    <i class="fas fa-clock me-2"></i>
                                    Schedule Download
                                </button>
                            </div>
                            
                            <div class="bulk-info mt-3">
                                <div class="info-item">
                                    <i class="fas fa-clock me-2"></i>
                                    <span>Estimated Time: ${bulk.estimated_time}</span>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-compress me-2"></i>
                                    <span>Space Saved: ${bulk.compression.savings}</span>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-server me-2"></i>
                                    <span>Server: ${bulk.servers[0]} (Fastest)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCategoryIcon(type) {
        const icons = {
            images: 'images',
            videos: 'video',
            documents: 'file-alt',
            audio: 'music'
        };
        return icons[type] || 'file';
    }

    // Premium interaction methods
    viewPremiumImage(url) {
        // Enhanced image viewer with premium features
        this.showPremiumToast('Premium image viewer opened!', 'info');
        window.open(url, '_blank');
    }

    downloadPremiumImage(url, filename) {
        this.showPremiumToast(`Downloading ${filename} in premium quality...`, 'success');
        // Simulate download
        setTimeout(() => {
            this.showPremiumToast('Premium download completed!', 'success');
        }, 2000);
    }

    playPremiumVideo(url) {
        this.showPremiumToast('Premium video player opened!', 'info');
        // Open premium video player
    }

    downloadPremiumVideo(url, filename) {
        this.showPremiumToast(`Downloading ${filename} in 4K quality...`, 'success');
        // Simulate download
        setTimeout(() => {
            this.showPremiumToast('4K video download completed!', 'success');
        }, 3000);
    }

    startBulkDownload() {
        this.showPremiumToast('Starting premium bulk download...', 'info');
        this.showBulkDownloadProgress();
    }

    showBulkDownloadProgress() {
        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content premium-modal">
                    <div class="modal-header premium-modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-download me-2"></i>Bulk Download Progress
                        </h5>
                    </div>
                    <div class="modal-body">
                        <div class="download-progress">
                            <div class="progress mb-3" style="height: 20px;">
                                <div class="progress-bar progress-bar-striped progress-bar-animated bg-premium" 
                                     id="bulkProgress" style="width: 0%"></div>
                            </div>
                            <div class="download-stats">
                                <div class="row text-center">
                                    <div class="col-4">
                                        <div class="stat-value" id="downloadedCount">0</div>
                                        <div class="stat-label">Downloaded</div>
                                    </div>
                                    <div class="col-4">
                                        <div class="stat-value" id="downloadSpeed">0 MB/s</div>
                                        <div class="stat-label">Speed</div>
                                    </div>
                                    <div class="col-4">
                                        <div class="stat-value" id="timeRemaining">--:--</div>
                                        <div class="stat-label">Time Left</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" onclick="this.closest('.modal').remove()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.animateBulkDownload();
    }

    animateBulkDownload() {
        let progress = 0;
        const progressBar = document.getElementById('bulkProgress');
        const countElement = document.getElementById('downloadedCount');
        const speedElement = document.getElementById('downloadSpeed');
        const timeElement = document.getElementById('timeRemaining');

        const interval = setInterval(() => {
            progress += Math.random() * 10 + 5;
            if (progress > 100) progress = 100;

            if (progressBar) progressBar.style.width = progress + '%';
            if (countElement) countElement.textContent = Math.floor(progress * 12.47);
            if (speedElement) speedElement.textContent = (Math.random() * 10 + 15).toFixed(1) + ' MB/s';
            if (timeElement) {
                const remaining = Math.floor((100 - progress) * 1.5);
                timeElement.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
            }

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.showPremiumToast('Bulk download completed successfully!', 'success');
                    document.querySelector('.modal.show')?.remove();
                }, 1000);
            }
        }, 200);
    }

    // Premium utility methods
    showPremiumLoading() {
        const overlay = document.getElementById('premiumLoadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hidePremiumLoading() {
        const overlay = document.getElementById('premiumLoadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showUpgradeModal() {
        const modal = new bootstrap.Modal(document.getElementById('upgradeModal'));
        modal.show();
    }

    showPremiumToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type} premium-toast`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getPremiumToastIcon(type)} me-2"></i>
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
            background: ${this.getPremiumToastColor(type)};
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            box-shadow: 0 12px 35px rgba(255, 215, 0, 0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.3);
            z-index: 10000;
            transform: translateX(400px) scale(0.8);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            animation: premiumToastBounce 0.5s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateX(0) scale(1)';
        }, 100);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.transform = 'translateX(400px) scale(0.8)';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    getPremiumToastIcon(type) {
        const icons = {
            success: 'fa-crown',
            error: 'fa-exclamation-triangle',
            info: 'fa-star',
            warning: 'fa-exclamation-circle'
        };
        return icons[type] || icons.info;
    }

    getPremiumToastColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #ffd700, #ff6b35)',
            error: 'linear-gradient(135deg, #ff4444, #cc0000)',
            info: 'linear-gradient(135deg, #ffd700, #ff0066)',
            warning: 'linear-gradient(135deg, #ffbb33, #ff8800)'
        };
        return colors[type] || colors.info;
    }

    // Animation and utility methods
    addPremiumRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: premiumRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    animatePremiumSelection(element) {
        element.style.animation = 'premiumSelectionPulse 0.8s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 800);
    }

    animatePremiumResults() {
        const resultsCards = document.querySelectorAll('.premium-image-card, .premium-video-card');
        resultsCards.forEach((card, index) => {
            card.style.animation = `premiumCardAppear 0.6s ease-out ${index * 0.1}s both`;
        });
    }

    animateNumber(element, start, end, duration) {
        const startTime = Date.now();
        const tick = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };
        tick();
    }

    setupPremiumAnimations() {
        // Add premium-specific CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes premiumToastBounce {
                0% { transform: translateX(400px) scale(0.3); opacity: 0; }
                50% { transform: translateX(-20px) scale(1.05); opacity: 1; }
                100% { transform: translateX(0) scale(1); opacity: 1; }
            }
            
            @keyframes premiumRipple {
                to { transform: scale(4); opacity: 0; }
            }
            
            @keyframes premiumSelectionPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); box-shadow: 0 0 30px var(--premium-glow); }
                100% { transform: scale(1); }
            }
            
            @keyframes premiumCardAppear {
                0% { transform: translateY(30px) scale(0.9); opacity: 0; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    setupAdvancedFeatures() {
        // Setup advanced premium features
        this.setupCloudIntegration();
        this.setupAIEnhancement();
        this.setupBulkOperations();
    }

    setupCloudIntegration() {
        // Cloud backup and sync functionality
        console.log('Premium cloud integration initialized');
    }

    setupAIEnhancement() {
        // AI-powered content enhancement
        console.log('Premium AI enhancement initialized');
    }

    setupBulkOperations() {
        // Bulk download and processing capabilities
        console.log('Premium bulk operations initialized');
    }

    updatePremiumSetting(setting, value) {
        this.premiumFeatures[setting] = value;
        this.savePremiumSettings();
        this.showPremiumToast(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`, 'info');
    }

    loadPremiumSettings() {
        const saved = localStorage.getItem('premiumSettings');
        if (saved) {
            this.premiumFeatures = { ...this.premiumFeatures, ...JSON.parse(saved) };
            this.applyPremiumSettings();
        }
    }

    savePremiumSettings() {
        localStorage.setItem('premiumSettings', JSON.stringify(this.premiumFeatures));
    }

    applyPremiumSettings() {
        Object.entries(this.premiumFeatures).forEach(([key, value]) => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = value;
            }
        });
    }

    async simulatePremiumProcessing() {
        // Simulate advanced AI processing
        return new Promise(resolve => {
            setTimeout(resolve, Math.random() * 2000 + 1000);
        });
    }
}

// Initialize Premium Scraper when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.premiumScraper = new PremiumScraper();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumScraper;
}
