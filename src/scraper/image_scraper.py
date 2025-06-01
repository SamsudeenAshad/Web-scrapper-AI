import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re

class ImageScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scrape_images(self, url):
        """Scrape all images from a given URL"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            images = []
            
            # Find all img tags
            img_tags = soup.find_all('img')
            
            for i, img in enumerate(img_tags):
                src = img.get('src')
                if src and src.strip():  # Ensure src is not empty or whitespace
                    # Skip data URLs and invalid URLs
                    if src.startswith('data:') or src.startswith('javascript:'):
                        continue
                        
                    # Convert relative URLs to absolute
                    full_url = urljoin(url, src)
                    
                    # Validate the URL format
                    if not self._is_valid_image_url(full_url):
                        continue
                    
                    alt = img.get('alt', f'Image {i+1}')
                    
                    # Get image dimensions if available
                    width = img.get('width', 'auto')
                    height = img.get('height', 'auto')
                    
                    # Ensure we have both 'src' and 'url' for compatibility
                    images.append({
                        'index': i,
                        'src': full_url,  # Frontend expects 'src' property
                        'url': full_url,  # Keep 'url' for backward compatibility
                        'alt': alt,
                        'width': width,
                        'height': height,
                        'filename': self._get_filename_from_url(full_url)
                    })
            
            # Also check for images in CSS background-image
            style_images = self._extract_css_background_images(soup, url)
            images.extend(style_images)
            
            return images
        
        except Exception as e:
            raise Exception(f"Error scraping images: {str(e)}")
    
    def _get_filename_from_url(self, url):
        """Extract filename from URL"""
        parsed = urlparse(url)
        filename = parsed.path.split('/')[-1]
        if not filename or '.' not in filename:
            filename = 'image.jpg'
        return filename
    
    def _is_valid_image_url(self, url):
        """Check if URL points to a valid image"""
        try:
            parsed = urlparse(url)
            if not parsed.scheme or not parsed.netloc:
                return False
            
            # Check for common image extensions
            image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico']
            path_lower = parsed.path.lower()
            
            # If URL has image extension, it's likely an image
            if any(path_lower.endswith(ext) for ext in image_extensions):
                return True
            
            # If no extension, assume it might be an image (some sites use dynamic URLs)
            return True
            
        except Exception:
            return False
    
    def _extract_css_background_images(self, soup, base_url):
        """Extract images from CSS background-image properties"""
        images = []
        
        # Find all elements with style attribute
        styled_elements = soup.find_all(attrs={'style': True})
        
        for i, element in enumerate(styled_elements):
            style = element.get('style', '')
            # Look for background-image URLs
            bg_matches = re.findall(r'background-image:\s*url\(["\']?([^"\')\s]+)["\']?\)', style)
            
            for bg_url in bg_matches:
                if bg_url and bg_url.strip():
                    full_url = urljoin(base_url, bg_url)
                    if self._is_valid_image_url(full_url):
                        images.append({
                            'index': len(images),
                            'src': full_url,  # Frontend expects 'src' property
                            'url': full_url,  # Keep 'url' for backward compatibility
                            'alt': f'Background Image {i+1}',
                            'width': 'auto',
                            'height': 'auto',
                            'filename': self._get_filename_from_url(full_url),
                            'type': 'background'
                        })
        
        return images
