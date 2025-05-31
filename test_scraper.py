#!/usr/bin/env python3
"""
Simple test script to verify the web scraper functionality
"""

import requests
import json

def test_scraper_api():
    """Test all scraper endpoints"""
    base_url = "http://127.0.0.1:5000"
    test_url = "https://httpbin.org/html"
    
    print("🕷️  Testing Shad AI Web Scraper API\n")
    print("=" * 50)
    
    # Test 1: Content Scraping
    print("\n1. Testing Content Scraping...")
    try:
        response = requests.post(f"{base_url}/scrape", 
                               json={"url": test_url, "type": "content"},
                               headers={"Content-Type": "application/json"})
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Content scraping successful!")
            print(f"   📄 Word count: {data['content']['word_count']}")
            print(f"   📝 Character count: {len(data['content']['full_text'])}")
            print(f"   🔤 Headings found: {len(data['content']['headings'])}")
        else:
            print(f"   ❌ Content scraping failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: URLs Scraping
    print("\n2. Testing URLs Scraping...")
    try:
        response = requests.post(f"{base_url}/scrape", 
                               json={"url": test_url, "type": "urls"},
                               headers={"Content-Type": "application/json"})
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ URLs scraping successful!")
            print(f"   🔗 Total URLs: {data['urls']['totals']['total']}")
            print(f"   🏠 Internal: {data['urls']['totals']['internal']}")
            print(f"   🌍 External: {data['urls']['totals']['external']}")
        else:
            print(f"   ❌ URLs scraping failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Images & Videos Scraping
    print("\n3. Testing Images & Videos Scraping...")
    try:
        response = requests.post(f"{base_url}/scrape", 
                               json={"url": test_url, "type": "images_videos"},
                               headers={"Content-Type": "application/json"})
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Media scraping successful!")
            print(f"   🖼️  Images found: {len(data['images'])}")
            print(f"   🎥 Videos found: {len(data['videos'])}")
        else:
            print(f"   ❌ Media scraping failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 4: Homepage Access
    print("\n4. Testing Homepage Access...")
    try:
        response = requests.get(base_url)
        if response.status_code == 200:
            print(f"   ✅ Homepage accessible!")
            print(f"   📄 Content length: {len(response.text)} characters")
        else:
            print(f"   ❌ Homepage failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Testing completed!")
    print("\n💡 Next steps:")
    print("   1. Open http://127.0.0.1:5000 in your browser")
    print("   2. Test the beautiful new UI")
    print("   3. Try scraping different types of content")
    print("   4. Check the dark/light mode toggle")
    print("   5. Explore the demo and tour features")

if __name__ == "__main__":
    test_scraper_api()
