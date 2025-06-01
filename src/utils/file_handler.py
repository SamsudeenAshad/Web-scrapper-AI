import os
import requests
from urllib.parse import urlparse
from datetime import datetime
import shutil

class FileHandler:
    def __init__(self):
        self.downloads_folder = 'downloads'
        os.makedirs(self.downloads_folder, exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def download_image(self, image_url, index=0):
        """Download an image from URL"""
        try:
            response = self.session.get(image_url, timeout=30, stream=True)
            response.raise_for_status()
            
            # Get filename
            filename = self._get_safe_filename(image_url, f'image_{index}', 'jpg')
            filepath = os.path.join(self.downloads_folder, filename)
            
            # Download and save
            with open(filepath, 'wb') as f:
                shutil.copyfileobj(response.raw, f)
            
            return filepath
        
        except Exception as e:
            raise Exception(f"Error downloading image: {str(e)}")
    
    def download_video(self, video_url, index=0):
        """Download a video from URL"""
        try:
            response = self.session.get(video_url, timeout=60, stream=True)
            response.raise_for_status()
            
            # Get filename
            filename = self._get_safe_filename(video_url, f'video_{index}', 'mp4')
            filepath = os.path.join(self.downloads_folder, filename)
            
            # Download and save
            with open(filepath, 'wb') as f:
                shutil.copyfileobj(response.raw, f)
            
            return filepath
        
        except Exception as e:
            raise Exception(f"Error downloading video: {str(e)}")
    
    def download_file(self, file_url, index=0):
        """Download any file from URL"""
        try:
            response = self.session.get(file_url, timeout=60, stream=True)
            response.raise_for_status()
            
            # Get filename
            filename = self._get_safe_filename(file_url, f'file_{index}', 'bin')
            filepath = os.path.join(self.downloads_folder, filename)
            
            # Download and save
            with open(filepath, 'wb') as f:
                shutil.copyfileobj(response.raw, f)
            
            return filepath
        
        except Exception as e:
            raise Exception(f"Error downloading file: {str(e)}")
    
    def _get_safe_filename(self, url, default_name, extension):
        """Generate a safe filename from URL or default name"""
        try:
            parsed = urlparse(url)
            name = os.path.basename(parsed.path)
            if not name:
                name = f"{default_name}.{extension}"
            else:
                # Remove query parameters if present
                name = name.split('?')[0]
                # Add extension if missing
                if not os.path.splitext(name)[1]:
                    name = f"{name}.{extension}"
            
            # Make filename safe
            name = "".join([c for c in name if c.isalpha() or c.isdigit() or c in '._- ']).rstrip()
            # Add timestamp to prevent overwriting
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            base, ext = os.path.splitext(name)
            return f"{base}_{timestamp}{ext}"
        except:
            return f"{default_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{extension}"
    
    def get_file_info(self, filepath):
        """Get information about a downloaded file"""
        try:
            if os.path.exists(filepath):
                stats = os.stat(filepath)
                return {
                    'size': stats.st_size,
                    'size_mb': round(stats.st_size / (1024 * 1024), 2),
                    'created': datetime.fromtimestamp(stats.st_ctime).strftime('%Y-%m-%d %H:%M:%S'),
                    'modified': datetime.fromtimestamp(stats.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
                    'extension': os.path.splitext(filepath)[1],
                    'filename': os.path.basename(filepath)
                }
            return None
        
        except Exception as e:
            return {'error': str(e)}
    
    def cleanup_old_files(self, max_age_hours=24):
        """Clean up old downloaded files"""
        try:
            now = datetime.now()
            deleted_count = 0
            
            for filename in os.listdir(self.downloads_folder):
                filepath = os.path.join(self.downloads_folder, filename)
                
                if os.path.isfile(filepath):
                    file_age = datetime.fromtimestamp(os.path.getctime(filepath))
                    age_hours = (now - file_age).total_seconds() / 3600
                    
                    if age_hours > max_age_hours:
                        os.remove(filepath)
                        deleted_count += 1
            
            return deleted_count
        
        except Exception as e:
            raise Exception(f"Error cleaning up files: {str(e)}")
    
    def list_downloaded_files(self):
        """List all downloaded files"""
        try:
            files = []
            
            for filename in os.listdir(self.downloads_folder):
                filepath = os.path.join(self.downloads_folder, filename)
                
                if os.path.isfile(filepath):
                    file_info = self.get_file_info(filepath)
                    if file_info:
                        files.append(file_info)
            
            return sorted(files, key=lambda x: x['modified'], reverse=True)
        
        except Exception as e:
            return []
