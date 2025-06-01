import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re

class VideoScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scrape_videos(self, url):
        """Scrape all videos from a given URL"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            videos = []
            
            # Find all video tags
            video_tags = soup.find_all('video')
            
            for i, video in enumerate(video_tags):
                src = video.get('src')
                poster = video.get('poster')
                
                # Check for source tags within video
                sources = video.find_all('source')
                video_sources = []
                
                if src:
                    video_sources.append({
                        'url': urljoin(url, src),
                        'type': video.get('type', 'video/mp4')
                    })
                
                for source in sources:
                    source_src = source.get('src')
                    if source_src:
                        video_sources.append({
                            'url': urljoin(url, source_src),
                            'type': source.get('type', 'video/mp4')
                        })
                
                if video_sources:
                    videos.append({
                        'index': i,
                        'src': video_sources[0]['url'],  # Frontend expects 'src' property
                        'url': video_sources[0]['url'],  # Keep 'url' for backward compatibility
                        'sources': video_sources,
                        'poster': urljoin(url, poster) if poster else None,
                        'controls': video.has_attr('controls'),
                        'autoplay': video.has_attr('autoplay'),
                        'width': video.get('width', 'auto'),
                        'height': video.get('height', 'auto'),
                        'filename': self._get_filename_from_url(video_sources[0]['url'])
                    })
            
            # Find iframe videos (YouTube, Vimeo, etc.)
            iframe_videos = self._extract_iframe_videos(soup, url)
            videos.extend(iframe_videos)
            
            return videos
        
        except Exception as e:
            raise Exception(f"Error scraping videos: {str(e)}")
    
    def _extract_iframe_videos(self, soup, base_url):
        """Extract videos from iframe elements"""
        videos = []
        iframes = soup.find_all('iframe')
        
        for i, iframe in enumerate(iframes):
            src = iframe.get('src')
            if src:
                full_url = urljoin(base_url, src)
                
                # Check if it's a video platform
                if self._is_video_iframe(full_url):
                    videos.append({
                        'index': len(videos),
                        'src': full_url,  # Frontend expects 'src' property
                        'url': full_url,  # Keep 'url' for backward compatibility
                        'sources': [{
                            'url': full_url,
                            'type': 'iframe'
                        }],
                        'poster': None,
                        'controls': True,
                        'autoplay': False,
                        'width': iframe.get('width', '560'),
                        'height': iframe.get('height', '315'),
                        'filename': f'video_iframe_{i}.html',
                        'platform': self._get_video_platform(full_url)
                    })
        
        return videos
    
    def _is_video_iframe(self, url):
        """Check if iframe URL is from a video platform"""
        video_platforms = [
            'youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com',
            'twitch.tv', 'facebook.com/video', 'instagram.com'
        ]
        return any(platform in url.lower() for platform in video_platforms)
    
    def _get_video_platform(self, url):
        """Get the video platform name from URL"""
        if 'youtube' in url.lower() or 'youtu.be' in url.lower():
            return 'YouTube'
        elif 'vimeo' in url.lower():
            return 'Vimeo'
        elif 'dailymotion' in url.lower():
            return 'Dailymotion'
        elif 'twitch' in url.lower():
            return 'Twitch'
        elif 'facebook' in url.lower():
            return 'Facebook'
        elif 'instagram' in url.lower():
            return 'Instagram'
        else:
            return 'Unknown'
    
    def _get_filename_from_url(self, url):
        """Extract filename from URL"""
        parsed = urlparse(url)
        filename = parsed.path.split('/')[-1]
        if not filename or '.' not in filename:
            filename = 'video.mp4'
        return filename
