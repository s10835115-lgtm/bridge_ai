import cv2
import numpy as np
import os

def generate_crack_heatmap(original_img, edges, contours, output_path):
    """
    Generates a detection heatmap and overlay with bounding boxes.
    """
    # 1. Create a color heatmap from edges
    heatmap_color = cv2.applyColorMap(edges, cv2.COLORMAP_JET)
    
    # 2. Overlay heatmap on original image
    alpha = 0.6
    overlay = cv2.addWeighted(original_img, 1 - alpha, heatmap_color, alpha, 0)
    
    # 3. Draw bounding boxes around significant contours
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > 100: # Filter small noise
            x, y, w, h = cv2.boundingRect(cnt)
            cv2.rectangle(overlay, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.putText(overlay, 'CRACK', (x, y - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

    # Save the processed result
    cv2.imwrite(output_path, overlay)
    
    return output_path
