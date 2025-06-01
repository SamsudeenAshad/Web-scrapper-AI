from flask import Flask, render_template, request, jsonify, send_file, flash, redirect, url_for
from flask_cors import CORS
import os
import json
import sys
from werkzeug.utils import secure_filename

# Add src directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from config import Config
from scraper.image_scraper import ImageScraper
from scraper.video_scraper import VideoScraper
from scraper.content_scraper import ContentScraper
from scraper.url_scraper import URLScraper
from utils.document_generator import DocumentGenerator
from utils.file_handler import FileHandler

app = Flask(__name__, template_folder='src/templates', static_folder='src/static')
app.config.from_object(Config)
CORS(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize scrapers
image_scraper = ImageScraper()
video_scraper = VideoScraper()
content_scraper = ContentScraper()
url_scraper = URLScraper()
doc_generator = DocumentGenerator()
file_handler = FileHandler()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    try:
        data = request.get_json()
        url = data.get('url')
        scrape_type = data.get('type')  # 'images_videos', 'content', 'urls'
        
        if not url or not scrape_type:
            return jsonify({'error': 'URL and scrape type are required'}), 400
        
        results = {}
        
        if scrape_type == 'images_videos':
            images = image_scraper.scrape_images(url)
            videos = video_scraper.scrape_videos(url)
            results = {
                'type': 'images_videos',
                'images': images,
                'videos': videos,
                'url': url
            }
        elif scrape_type == 'content':
            content = content_scraper.scrape_content(url)
            results = {
                'type': 'content',
                'content': content,
                'url': url
            }
        elif scrape_type == 'urls':
            urls = url_scraper.scrape_urls(url)
            results = {
                'type': 'urls',
                'urls': urls,
                'url': url
            }
        else:
            return jsonify({'error': 'Invalid scrape type'}), 400
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download', methods=['POST'])
def download_item():
    try:
        data = request.get_json()
        url = data.get('url')
        item_type = data.get('type')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
            
        if item_type == 'image':
            filename = file_handler.download_image(url)
            return send_file(filename, as_attachment=True)
            
        elif item_type == 'video':
            filename = file_handler.download_video(url)
            return send_file(filename, as_attachment=True)
            
        elif item_type == 'content':
            # Generate and download Word document
            content_json = request.args.get('content', '{}')
            try:
                content_data = json.loads(content_json)
            except:
                content_data = {'full_text': content_json, 'title': 'Scraped Content'}
            
            filename = doc_generator.create_document(content_data)
            return send_file(filename, as_attachment=True, download_name='scraped_content.docx')
            
        else:
            return jsonify({'error': 'Invalid item type'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/preview')
def preview():
    return render_template('preview.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
