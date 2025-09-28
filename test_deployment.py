#!/usr/bin/env python3
"""
Test script for deployment readiness
"""
import os
import sys
import subprocess
import requests
import time
from pathlib import Path

def test_requirements():
    """Test if all requirements can be installed"""
    print("Testing requirements installation...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "api/requirements.txt"], 
                      check=True, capture_output=True)
        print("✅ Requirements installation successful")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Requirements installation failed: {e}")
        return False

def test_app_import():
    """Test if the Flask app can be imported"""
    print("Testing Flask app import...")
    try:
        sys.path.insert(0, str(Path(__file__).parent / "api"))
        import index
        print("✅ Flask app import successful")
        return True
    except Exception as e:
        print(f"❌ Flask app import failed: {e}")
        return False

def test_gunicorn():
    """Test if Gunicorn can start the app"""
    print("Testing Gunicorn startup...")
    try:
        os.chdir("api")
        process = subprocess.Popen([
            "gunicorn", "index:app", "--bind", "127.0.0.1:5003", "--timeout", "10"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for server to start
        time.sleep(3)
        
        # Test if server responds
        response = requests.get("http://127.0.0.1:5003/", timeout=5)
        
        # Kill the process
        process.terminate()
        process.wait()
        
        if response.status_code == 200:
            print("✅ Gunicorn startup and response successful")
            return True
        else:
            print(f"❌ Gunicorn response failed: {response.status_code}")
            return False
            
    except Exception as e:
        if 'process' in locals():
            process.terminate()
        print(f"❌ Gunicorn test failed: {e}")
        return False
    finally:
        os.chdir("..")

def main():
    """Run all deployment tests"""
    print("🚀 Running deployment readiness tests...\n")
    
    tests = [
        test_requirements,
        test_app_import,
        test_gunicorn
    ]
    
    results = []
    for test in tests:
        results.append(test())
        print()
    
    if all(results):
        print("🎉 All tests passed! Your backend is ready for deployment.")
        return 0
    else:
        print("❌ Some tests failed. Please fix the issues before deploying.")
        return 1

if __name__ == "__main__":
    exit(main())
