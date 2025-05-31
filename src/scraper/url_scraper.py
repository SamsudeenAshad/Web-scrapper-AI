import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re

class URLScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scrape_urls(self, url):
        """Scrape all URLs from a given URL"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            urls = {
                'internal_links': [],
                'external_links': [],
                'email_links': [],
                'tel_links': [],
                'file_links': [],
                'social_links': []
            }
            
            # Get base domain for internal/external classification
            base_domain = urlparse(url).netloc
            
            # Find all anchor tags
            a_tags = soup.find_all('a', href=True)
            
            for i, a in enumerate(a_tags):
                href = a.get('href')
                text = a.get_text().strip()
                title = a.get('title', '')
                
                if href:
                    full_url = urljoin(url, href)
                    parsed_url = urlparse(full_url)
                    
                    link_data = {
                        'index': i,
                        'url': full_url,
                        'text': text,
                        'title': title,
                        'original_href': href
                    }
                    
                    # Classify the link
                    if href.startswith('mailto:'):
                        urls['email_links'].append({
                            **link_data,
                            'email': href.replace('mailto:', '')
                        })
                    elif href.startswith('tel:'):
                        urls['tel_links'].append({
                            **link_data,
                            'phone': href.replace('tel:', '')
                        })
                    elif self._is_file_link(href):
                        urls['file_links'].append({
                            **link_data,
                            'file_type': self._get_file_extension(href)
                        })
                    elif self._is_social_link(full_url):
                        urls['social_links'].append({
                            **link_data,
                            'platform': self._get_social_platform(full_url)
                        })
                    elif parsed_url.netloc == base_domain or not parsed_url.netloc:
                        urls['internal_links'].append(link_data)
                    else:
                        urls['external_links'].append(link_data)
            
            # Count totals
            urls['totals'] = {
                'internal': len(urls['internal_links']),
                'external': len(urls['external_links']),
                'email': len(urls['email_links']),
                'tel': len(urls['tel_links']),
                'file': len(urls['file_links']),
                'social': len(urls['social_links']),
                'total': sum([
                    len(urls['internal_links']),
                    len(urls['external_links']),
                    len(urls['email_links']),
                    len(urls['tel_links']),
                    len(urls['file_links']),
                    len(urls['social_links'])
                ])
            }
            
            return urls
        
        except Exception as e:
            raise Exception(f"Error scraping URLs: {str(e)}")
    
    def _is_file_link(self, href):
        """Check if the link points to a file"""
        file_extensions = [
            '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
            '.zip', '.rar', '.tar', '.gz', '.7z',
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg',
            '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm',
            '.mp3', '.wav', '.ogg', '.m4a',
            '.txt', '.csv', '.json', '.xml'
        ]
        return any(href.lower().endswith(ext) for ext in file_extensions)
    
    def _get_file_extension(self, href):
        """Get file extension from href"""
        parsed = urlparse(href)
        path = parsed.path.lower()
        if '.' in path:
            return path.split('.')[-1]
        return 'unknown'
    
    def _is_social_link(self, url):
        """Check if the link is a social media link"""
        social_domains = [
            'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com',
            'youtube.com', 'tiktok.com', 'snapchat.com', 'pinterest.com',
            'reddit.com', 'tumblr.com', 'discord.com', 'telegram.org',
            'whatsapp.com', 'github.com', 'gitlab.com'
        ]
        return any(domain in url.lower() for domain in social_domains)
    
    def _get_social_platform(self, url):
        """Get social media platform name from URL"""
        url_lower = url.lower()
        if 'facebook.com' in url_lower:
            return 'Facebook'
        elif 'twitter.com' in url_lower:
            return 'Twitter'
        elif 'instagram.com' in url_lower:
            return 'Instagram'
        elif 'linkedin.com' in url_lower:
            return 'LinkedIn'
        elif 'youtube.com' in url_lower:
            return 'YouTube'
        elif 'tiktok.com' in url_lower:
            return 'TikTok'
        elif 'snapchat.com' in url_lower:
            return 'Snapchat'
        elif 'pinterest.com' in url_lower:
            return 'Pinterest'
        elif 'reddit.com' in url_lower:
            return 'Reddit'
        elif 'tumblr.com' in url_lower:
            return 'Tumblr'
        elif 'discord.com' in url_lower:
            return 'Discord'
        elif 'telegram.org' in url_lower:
            return 'Telegram'
        elif 'whatsapp.com' in url_lower:
            return 'WhatsApp'
        elif 'github.com' in url_lower:
            return 'GitHub'
        elif 'gitlab.com' in url_lower:
            return 'GitLab'
        else:
            return 'Unknown'
