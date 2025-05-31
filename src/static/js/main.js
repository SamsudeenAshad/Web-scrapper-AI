// Main JavaScript for Web Scraper AI

document.addEventListener('DOMContentLoaded', function() {
    const scrapeForm = document.getElementById('scrapeForm');
    const scrapeOptions = document.querySelectorAll('.scrape-option');
    const scrapeTypeInput = document.getElementById('scrapeType');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsSection = document.getElementById('resultsSection');
    const errorSection = document.getElementById('errorSection');
    const resultsContent = document.getElementById('resultsContent');
    const errorMessage = document.getElementById('errorMessage');

    // Handle scrape option selection
    scrapeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            scrapeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Set the scrape type
            scrapeTypeInput.value = this.dataset.type;
        });
    });

    // Handle form submission
    scrapeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const url = document.getElementById('url').value;
        const type = scrapeTypeInput.value;
        
        if (!type) {
            alert('Please select a content type to scrape');
            return;
        }
        
        startScraping(url, type);
    });

    function startScraping(url, type) {
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        resultsSection.style.display = 'none';
        errorSection.style.display = 'none';
        
        // Disable form
        scrapeForm.style.pointerEvents = 'none';
        scrapeForm.style.opacity = '0.7';
        
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

    function showError(message) {
        errorSection.style.display = 'block';
        resultsSection.style.display = 'none';
        errorMessage.textContent = message;
    }
});

// Global functions for downloads
function downloadItem(type, index, url) {
    const downloadUrl = `/download/${type}/${index}?url=${encodeURIComponent(url)}`;
    window.open(downloadUrl, '_blank');
}

function downloadContent(contentData) {
    const downloadUrl = `/download/content/0?content=${contentData}`;
    window.open(downloadUrl, '_blank');
}
