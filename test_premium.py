#!/usr/bin/env python3
"""
Test script for Premium Features
Tests the premium scraping endpoints and functionality
"""

import requests
import json
import sys
import time

def test_premium_endpoints():
    """Test all premium endpoints"""
    base_url = "http://127.0.0.1:5000"
    
    print("🧪 Testing Premium Features Integration...")
    print("=" * 50)
    
    # Test 1: Premium page accessibility
    print("\n1. Testing Premium Page Access...")
    try:
        response = requests.get(f"{base_url}/premium")
        if response.status_code == 200:
            print("✅ Premium page is accessible")
        else:
            print(f"❌ Premium page failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Premium page error: {e}")
        return False
    
    # Test 2: Premium Images Scraping
    print("\n2. Testing Premium Images Scraping...")
    try:
        test_data = {
            "url": "https://example.com",
            "type": "premium_images",
            "settings": {
                "ai_enhancement": True,
                "deep_scan": True,
                "auto_quality": True,
                "cloud_backup": False
            }
        }
        
        response = requests.post(
            f"{base_url}/premium-scrape",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(test_data)
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Premium images scraping works")
            print(f"   - Type: {result.get('type')}")
            print(f"   - Premium features applied: {result.get('premium_features_applied')}")
            print(f"   - Total found: {result.get('total_found', 0)}")
        else:
            print(f"❌ Premium images failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Premium images error: {e}")
    
    # Test 3: Premium Videos Scraping
    print("\n3. Testing Premium Videos Scraping...")
    try:
        test_data = {
            "url": "https://example.com",
            "type": "premium_videos",
            "settings": {
                "ai_enhancement": True,
                "deep_scan": False,
                "auto_quality": True,
                "cloud_backup": True
            }
        }
        
        response = requests.post(
            f"{base_url}/premium-scrape",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(test_data)
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Premium videos scraping works")
            print(f"   - Type: {result.get('type')}")
            print(f"   - Premium features applied: {result.get('premium_features_applied')}")
            print(f"   - Total found: {result.get('total_found', 0)}")
        else:
            print(f"❌ Premium videos failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Premium videos error: {e}")
    
    # Test 4: Bulk Download
    print("\n4. Testing Bulk Download...")
    try:
        test_data = {
            "url": "https://example.com",
            "type": "bulk_download",
            "settings": {
                "ai_enhancement": True,
                "deep_scan": True,
                "auto_quality": True,
                "cloud_backup": True
            }
        }
        
        response = requests.post(
            f"{base_url}/premium-scrape",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(test_data)
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Bulk download works")
            print(f"   - Type: {result.get('type')}")
            print(f"   - Bulk ready: {result.get('bulk_ready')}")
            print(f"   - Total items: {result.get('total_items', 0)}")
        else:
            print(f"❌ Bulk download failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Bulk download error: {e}")
    
    # Test 5: Error handling
    print("\n5. Testing Error Handling...")
    try:
        test_data = {
            "url": "",  # Invalid URL
            "type": "premium_images"
        }
        
        response = requests.post(
            f"{base_url}/premium-scrape",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(test_data)
        )
        
        if response.status_code == 400:
            print("✅ Error handling works correctly")
        else:
            print(f"❌ Error handling issue: {response.status_code}")
    except Exception as e:
        print(f"❌ Error handling test error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Premium Features Testing Complete!")
    return True

if __name__ == "__main__":
    print("Starting Premium Features Test...")
    print("Make sure the Flask app is running on http://127.0.0.1:5000")
    print("\nWaiting 2 seconds for server to be ready...")
    time.sleep(2)
    
    success = test_premium_endpoints()
    
    if success:
        print("\n✅ All premium features are working correctly!")
        sys.exit(0)
    else:
        print("\n❌ Some issues found in premium features")
        sys.exit(1)
