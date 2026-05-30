import os

# macOS Fix: Stability environment variables
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from flask import request
from ..preprocessing.image_processor import ImageProcessor
from ..heatmaps.gradcam import generate_gradcam_heatmap, save_heatmap

class InferenceEngine:
    model = None
    image_processor = ImageProcessor()

    @classmethod
    def load_model(cls):
        model_path = os.path.join(os.path.dirname(__file__), '../models/crack_detector.h5')
        if os.path.exists(model_path):
            try:
                cls.model = tf.keras.models.load_model(model_path)
                print(f"AI Model loaded successfully from {model_path}")
                cls.model.summary()
            except Exception as e:
                print(f"Error loading AI model: {str(e)}")
        else:
            print(f"Warning: Model file not found at {model_path}. Using fallback simulation.")

    def predict(self, image_path):
        """
        Runs advanced structural AI inference with geometry analysis and debug visualization.
        """
        if self.model is None:
            print("Model not loaded. Attempting to load...")
            self.load_model()
            
        if self.model is None:
            return {"error": "AI Model not initialized and could not be loaded"}

        try:
            # 1. Advanced Preprocessing & Geometry Extraction
            processed_data = self.image_processor.preprocess(image_path)
            geometry = processed_data['geometry']
            
            # 2. Prepare for Neural Model
            img = tf.keras.utils.load_img(image_path, target_size=(224, 224))
            img_array = tf.keras.utils.img_to_array(img)
            img_batch = np.expand_dims(img_array, axis=0)
            processed_input = preprocess_input(img_batch)
            
            # 3. Neural Prediction
            prediction = self.model.predict(processed_input, verbose=0)
            confidence = float(prediction[0][0])
            
            # 4. Save Debug Visuals (Visual Debug Mode)
            heatmap_filename = f"heatmap_{os.path.basename(image_path)}"
            processed_dir = os.path.join(os.path.dirname(__file__), '../../app/uploads/processed')
            debug_dir = os.path.join(processed_dir, 'debug')
            os.makedirs(debug_dir, exist_ok=True)
            
            # Save Mask & Enhanced images for verification
            mask_path = os.path.join(debug_dir, f"mask_{os.path.basename(image_path)}")
            enhanced_path = os.path.join(debug_dir, f"enhanced_{os.path.basename(image_path)}")
            cv2.imwrite(mask_path, processed_data['mask'])
            cv2.imwrite(enhanced_path, processed_data['enhanced'])
            
            # Draw Accepted vs Rejected Contours for visual debugging
            debug_vis = processed_data['original'].copy()
            cv2.drawContours(debug_vis, processed_data['rejected_contours'], -1, (0, 0, 255), 1) # Red = Rejected
            cv2.drawContours(debug_vis, processed_data['contours'], -1, (0, 255, 0), 2) # Green = Accepted
            debug_vis_path = os.path.join(debug_dir, f"validation_{os.path.basename(image_path)}")
            cv2.imwrite(debug_vis_path, debug_vis)
            
            # 5. Generate Grad-CAM Heatmap
            heatmap_path = os.path.join(processed_dir, heatmap_filename)
            try:
                heatmap = generate_gradcam_heatmap(self.model, processed_input)
                save_heatmap(image_path, heatmap, heatmap_path)
            except Exception as cam_e:
                print(f"Grad-CAM Error: {cam_e}")
                import shutil
                shutil.copy(image_path, heatmap_path)
            
            # 6. Synchronized Prediction & Severity Logic
            # ROOT FIX: If neural model is sure it's not a crack, force Safe
            is_neural_crack = confidence > 0.45
            
            if not is_neural_crack:
                # Force Safe status regardless of contours (rejection logic)
                severity = "Safe"
                risk_level = int(confidence * 20) # Low risk
                desc = "No significant structural cracks detected. Surface texture analyzed as safe."
                final_crack_count = 0
                final_prediction = "No Crack"
            else:
                # Hybrid calculation for confirmed cracks
                risk_score = (confidence * 0.7) + (min(geometry['density'] * 15, 1) * 0.15) + (min(geometry['area_percentage'] * 100, 1) * 0.15)
                risk_level = int(risk_score * 100)
                final_crack_count = len(processed_data['contours'])
                final_prediction = "Crack Detected"
                
                if risk_score > 0.80 or geometry['max_width'] > 20:
                    severity = "Critical"
                    desc = "Major structural fracture or high-density crack clusters detected."
                elif risk_score > 0.50 or geometry['total_length'] > 600:
                    severity = "Moderate"
                    desc = "Visible crack propagation detected. Monitoring required."
                else:
                    severity = "Safe"
                    desc = "Minor surface hair-cracks detected. Routine maintenance recommended."

            return {
                "prediction": final_prediction,
                "confidence": round(confidence * 100, 2),
                "severity": severity,
                "risk_level": risk_level,
                "description": desc,
                "heatmap_image": f"{request.host_url.rstrip('/')}/uploads/processed/{heatmap_filename}",
                "crack_count": final_crack_count,
                "geometry": geometry,
                "debug": {
                    "validation_url": f"{request.host_url.rstrip('/')}/uploads/processed/debug/{os.path.basename(debug_vis_path)}",
                    "mask_url": f"{request.host_url.rstrip('/')}/uploads/processed/debug/{os.path.basename(mask_path)}",
                    "raw_val": round(confidence, 6)
                }
            }
            
        except Exception as e:
            import traceback
            print(f"Inference Error: {traceback.format_exc()}")
            return {
                "success": False,
                "message": "AI analysis failed during structural segmentation"
            }
