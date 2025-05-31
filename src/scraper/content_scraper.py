import requests
from bs4 import BeautifulSoup
import re

class ContentScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scrape_content(self, url):
        """Scrape text content from a given URL"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header", "aside"]):
                script.decompose()
            
            content = {
                'title': self._extract_title(soup),
                'meta_description': self._extract_meta_description(soup),
                'headings': self._extract_headings(soup),
                'paragraphs': self._extract_paragraphs(soup),
                'lists': self._extract_lists(soup),
                'tables': self._extract_tables(soup),
                'full_text': self._extract_clean_text(soup),
                'word_count': 0,
                'url': url
            }
            
            # Calculate word count
            content['word_count'] = len(content['full_text'].split())
            
            return content
        
        except Exception as e:
            raise Exception(f"Error scraping content: {str(e)}")
    
    def _extract_title(self, soup):
        """Extract page title"""
        title_tag = soup.find('title')
        if title_tag:
            return title_tag.get_text().strip()
        
        # Try h1 as fallback
        h1_tag = soup.find('h1')
        if h1_tag:
            return h1_tag.get_text().strip()
        
        return "No title found"
    
    def _extract_meta_description(self, soup):
        """Extract meta description"""
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            return meta_desc.get('content', '').strip()
        
        # Try Open Graph description
        og_desc = soup.find('meta', attrs={'property': 'og:description'})
        if og_desc:
            return og_desc.get('content', '').strip()
        
        return ""
    
    def _extract_headings(self, soup):
        """Extract all headings (h1-h6)"""
        headings = []
        for i in range(1, 7):
            heading_tags = soup.find_all(f'h{i}')
            for heading in heading_tags:
                text = heading.get_text().strip()
                if text:
                    headings.append({
                        'level': i,
                        'text': text
                    })
        return headings
    
    def _extract_paragraphs(self, soup):
        """Extract all paragraphs"""
        paragraphs = []
        p_tags = soup.find_all('p')
        
        for p in p_tags:
            text = p.get_text().strip()
            if text and len(text) > 20:  # Filter out very short paragraphs
                paragraphs.append(text)
        
        return paragraphs
    
    def _extract_lists(self, soup):
        """Extract all lists (ul, ol)"""
        lists = []
        
        # Unordered lists
        ul_tags = soup.find_all('ul')
        for ul in ul_tags:
            items = [li.get_text().strip() for li in ul.find_all('li')]
            if items:
                lists.append({
                    'type': 'unordered',
                    'items': items
                })
        
        # Ordered lists
        ol_tags = soup.find_all('ol')
        for ol in ol_tags:
            items = [li.get_text().strip() for li in ol.find_all('li')]
            if items:
                lists.append({
                    'type': 'ordered',
                    'items': items
                })
        
        return lists
    
    def _extract_tables(self, soup):
        """Extract all tables"""
        tables = []
        table_tags = soup.find_all('table')
        
        for table in table_tags:
            rows = []
            tr_tags = table.find_all('tr')
            
            for tr in tr_tags:
                cells = []
                # Check for both th and td
                cell_tags = tr.find_all(['th', 'td'])
                for cell in cell_tags:
                    cells.append(cell.get_text().strip())
                
                if cells:
                    rows.append(cells)
            
            if rows:
                tables.append({
                    'rows': rows,
                    'has_header': bool(table.find('th'))
                })
        
        return tables
    
    def _extract_clean_text(self, soup):
        """Extract clean text content"""
        # Get text from main content areas
        main_content = soup.find('main') or soup.find('article') or soup.find('div', class_=re.compile(r'content|main|body'))
        
        if main_content:
            text = main_content.get_text()
        else:
            text = soup.get_text()
        
        # Clean up the text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
