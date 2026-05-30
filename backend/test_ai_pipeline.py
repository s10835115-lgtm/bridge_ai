import os
import cv2
import sys

# Add backend to path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai.inference.predict import InferenceEngine

def test_pipeline(test_image_path):
    print(f"--- Starting AI Pipeline Test for: {test_image_path} ---")
    
    # 1. Initialize Engine
    engine = InferenceEngine()
    
    # 2. Setup output directory
    output_dir = os.path.join(os.path.dirname(__file__), 'app/uploads/processed')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # 3. Run Inference
    try:
        results = engine.run_inference(test_image_path, output_dir)
        print("\n[SUCCESS] AI Inference Results:")
        for key, value in results.items():
            print(f"  {key}: {value}")
            
    except Exception as e:
        print(f"\n[ERROR] Pipeline failed: {str(e)}")

if __name__ == "__main__":
    # Create a dummy image if no test image is provided
    dummy_path = "test_crack.jpg"
    if not os.path.exists(dummy_path):
        import numpy as np
        img = np.zeros((500, 500, 3), dtype=np.uint8)
        # Draw a fake crack line
        cv2.line(img, (100, 100), (400, 400), (255, 255, 255), 2)
        cv2.imwrite(dummy_path, img)
        print(f"Created dummy test image at {dummy_path}")
    
    test_pipeline(os.path.abspath(dummy_path))
