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
                if src:
                    # Convert relative URLs to absolute
                    full_url = urljoin(url, src)
                    alt = img.get('alt', f'Image {i+1}')
                    
                    # Get image dimensions if available
                    width = img.get('width', 'auto')
                    height = img.get('height', 'auto')
                    
                    images.append({
                        'index': i,
                        'url': full_url,
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
                full_url = urljoin(base_url, bg_url)
                images.append({
                    'index': len(images),
                    'url': full_url,
                    'alt': f'Background Image {i+1}',
                    'width': 'auto',
                    'height': 'auto',
                    'filename': self._get_filename_from_url(full_url),
                    'type': 'background'
                })
        
        return images
