import os
import sys

# macOS Fix: Disable GPU acceleration and oneDNN optimizations to prevent segmentation faults
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['OMP_NUM_THREADS'] = '1'

import tensorflow as tf
from PIL import Image
import pillow_avif
import cv2
from backend.ai.preprocessing.image_processor import ImageProcessor

# Explicitly disable GPU to prevent metal/macos plugin crashes
try:
    tf.config.set_visible_devices([], 'GPU')
except:
    pass
import numpy as np
try:
    from tensorflow.keras.applications import mobilenet_v2
    preprocess_input = mobilenet_v2.preprocess_input
except ImportError:
    from keras.applications import mobilenet_v2
    preprocess_input = mobilenet_v2.preprocess_input

def test_image(image_path):
    model_path = os.path.join(os.path.dirname(__file__), 'backend/ai/models/crack_detector.h5')
    processor = ImageProcessor()
    
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}")
        return

    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return

    print(f"Loading AI Model...")
    model = tf.keras.models.load_model(model_path)
    
    print(f"Analyzing Image: {image_path}")
    
    # 1. Geometry Analysis
    processed_data = processor.preprocess(image_path)
    geo = processed_data['geometry']
    
    # 2. Preparation for Model
    ext = os.path.splitext(image_path)[1].lower()
    if ext in ['.avif', '.webp']:
        temp_img = Image.open(image_path).convert('RGB')
        img = temp_img.resize((224, 224))
    else:
        img = tf.keras.utils.load_img(image_path, target_size=(224, 224))
        
    img_array = tf.keras.utils.img_to_array(img)
    img_batch = np.expand_dims(img_array, axis=0)
    processed_input = preprocess_input(img_batch)
    
    # 3. Prediction
    prediction = model.predict(processed_input, verbose=0)[0][0]
    
    # 4. Synchronized Severity Logic
    is_crack = prediction > 0.45
    
    if not is_crack:
        severity = "SAFE"
        risk_score = prediction * 0.2
        final_count = 0
    else:
        risk_score = (prediction * 0.7) + (min(geo['density'] * 15, 1) * 0.15) + (min(geo['area_percentage'] * 100, 1) * 0.15)
        final_count = len(processed_data['contours'])
        
        if risk_score > 0.80:
            severity = "CRITICAL"
        elif risk_score > 0.50:
            severity = "MODERATE"
        else:
            severity = "SAFE (MINOR)"
    
    print("\n--- ADVANCED ANALYSIS RESULTS ---")
    print(f"Neural Confidence: {prediction * 100:.2f}%")
    print(f"Crack Count (Validated): {final_count}")
    print(f"Crack Density: {geo['density']} units")
    print(f"Area Percentage: {geo['area_percentage']}%")
    print(f"Combined Risk Score: {risk_score:.4f}")
    print(f"Final Severity: {severity}")
    print(f"Classification: {'CRACK DETECTED' if is_crack else 'SAFE / NO CRACK'}")
    print("----------------------------------\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_single_image.py <path_to_image>")
    else:
        test_image(sys.argv[1])
