#!/usr/bin/env python3
"""
Backend API Testing Script
Tests all backend endpoints for the financial application
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    base_url = line.split('=')[1].strip()
                    return f"{base_url}/api"
        return None
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

def test_root_endpoint(base_url):
    """Test GET /api/ endpoint"""
    print("\n=== Testing Root Endpoint ===")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ Root endpoint working correctly")
                return True
            else:
                print(f"❌ Unexpected response message: {data}")
                return False
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_create_status_check(base_url):
    """Test POST /api/status endpoint"""
    print("\n=== Testing Create Status Check ===")
    try:
        # Test data with realistic client name
        test_data = {
            "client_name": "Financial Dashboard Client"
        }
        
        response = requests.post(
            f"{base_url}/status", 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "client_name", "timestamp"]
            
            if all(field in data for field in required_fields):
                if data["client_name"] == test_data["client_name"]:
                    print("✅ Create status check working correctly")
                    return True, data["id"]
                else:
                    print(f"❌ Client name mismatch: expected {test_data['client_name']}, got {data['client_name']}")
                    return False, None
            else:
                missing_fields = [field for field in required_fields if field not in data]
                print(f"❌ Missing required fields: {missing_fields}")
                return False, None
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, None

def test_get_status_checks(base_url, expected_id=None):
    """Test GET /api/status endpoint"""
    print("\n=== Testing Get Status Checks ===")
    try:
        response = requests.get(f"{base_url}/status", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Number of status checks: {len(data)}")
            
            if isinstance(data, list):
                if len(data) > 0:
                    # Check structure of first item
                    first_item = data[0]
                    required_fields = ["id", "client_name", "timestamp"]
                    
                    if all(field in first_item for field in required_fields):
                        print("✅ Get status checks working correctly")
                        
                        # If we have an expected ID from create test, verify it exists
                        if expected_id:
                            found_id = any(item["id"] == expected_id for item in data)
                            if found_id:
                                print(f"✅ Created status check found in list")
                            else:
                                print(f"⚠️ Created status check not found in list")
                        
                        return True
                    else:
                        missing_fields = [field for field in required_fields if field not in first_item]
                        print(f"❌ Missing required fields in response: {missing_fields}")
                        return False
                else:
                    print("✅ Get status checks working (empty list)")
                    return True
            else:
                print(f"❌ Response is not a list: {type(data)}")
                return False
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_error_handling(base_url):
    """Test error handling for invalid requests"""
    print("\n=== Testing Error Handling ===")
    
    # Test POST with missing client_name
    try:
        response = requests.post(
            f"{base_url}/status", 
            json={},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"POST with empty body - Status Code: {response.status_code}")
        
        if response.status_code == 422:  # FastAPI validation error
            print("✅ Proper validation error for missing client_name")
        else:
            print(f"⚠️ Unexpected status code for validation error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing validation: {e}")
    
    # Test invalid endpoint
    try:
        response = requests.get(f"{base_url}/nonexistent", timeout=10)
        print(f"GET nonexistent endpoint - Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Proper 404 for nonexistent endpoint")
        else:
            print(f"⚠️ Unexpected status code for 404: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing 404: {e}")

def main():
    """Main test function"""
    print("🚀 Starting Backend API Tests")
    print("=" * 50)
    
    # Get backend URL
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not determine backend URL from frontend/.env")
        sys.exit(1)
    
    print(f"Testing backend at: {base_url}")
    
    # Track test results
    test_results = []
    
    # Test 1: Root endpoint
    result1 = test_root_endpoint(base_url)
    test_results.append(("Root Endpoint", result1))
    
    # Test 2: Create status check
    result2, created_id = test_create_status_check(base_url)
    test_results.append(("Create Status Check", result2))
    
    # Test 3: Get status checks
    result3 = test_get_status_checks(base_url, created_id)
    test_results.append(("Get Status Checks", result3))
    
    # Test 4: Error handling
    test_error_handling(base_url)
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend API tests passed!")
        return True
    else:
        print("⚠️ Some backend API tests failed!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)