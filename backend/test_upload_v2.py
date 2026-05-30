import requests
import os
from PIL import Image

# Configuration
BASE_URL = "http://localhost:5001/api"
LOGIN_URL = f"{BASE_URL}/auth/login"
UPLOAD_URL = f"{BASE_URL}/upload"

# Test Credentials
credentials = {
    "email": "test_upload@example.com",
    "password": "password123"
}

def test_upload():
    # 1. Login to get token
    print("Attempting to login...")
    try:
        response = requests.post(LOGIN_URL, json=credentials)
        if response.status_code != 200:
            print(f"Login failed: {response.json()}")
            return
        
        token = response.json()['data']['token']
        print("Login successful.")
        
        # 2. Upload an image
        dummy_image_path = "test_image.jpg"
        img = Image.new('RGB', (224, 224), color = (73, 109, 137))
        img.save(dummy_image_path)
        
        print(f"Attempting to upload {dummy_image_path}...")
        headers = {"Authorization": f"Bearer {token}"}
        with open(dummy_image_path, "rb") as f:
            files = {"image": (dummy_image_path, f, "image/jpeg")}
            upload_response = requests.post(UPLOAD_URL, headers=headers, files=files)
            
        print(f"Upload Status Code: {upload_response.status_code}")
        print(f"Upload Response: {upload_response.json()}")
        
        # Clean up
        os.remove(dummy_image_path)
        
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_upload()
