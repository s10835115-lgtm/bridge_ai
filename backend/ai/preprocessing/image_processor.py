import cv2
import numpy as np

class ImageProcessor:
    def __init__(self, target_size=(224, 224)):
        self.target_size = target_size

    def preprocess(self, image_path):
        """
        Industrial-grade crack segmentation with texture rejection and geometric validation.
        """
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not read image: {image_path}")
        
        # 1. Contrast Enhancement (CLAHE)
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl,a,b))
        enhanced = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
        
        # 2. Multi-stage Noise Reduction
        gray = cv2.cvtColor(enhanced, cv2.COLOR_BGR2GRAY)
        # Median blur is excellent for removing texture "speckles"
        denoised = cv2.medianBlur(gray, 5)
        # Bilateral filter preserves edges while smoothing flat areas
        smoothed = cv2.bilateralFilter(denoised, 9, 75, 75)
        
        # 3. Edge Extraction (Scharr)
        grad_x = cv2.Scharr(smoothed, cv2.CV_64F, 1, 0)
        grad_y = cv2.Scharr(smoothed, cv2.CV_64F, 0, 1)
        grad = cv2.magnitude(grad_x, grad_y)
        grad = np.uint8(np.absolute(grad))
        
        # 4. Adaptive Thresholding
        thresh = cv2.adaptiveThreshold(
            grad, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 11, 2
        )
        
        # 5. Advanced Morphological Filtering
        # Opening removes small objects (texture dots)
        kernel_small = np.ones((2,2), np.uint8)
        opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel_small, iterations=1)
        
        # Closing joins nearby crack segments
        kernel_large = np.ones((3,3), np.uint8)
        mask = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel_large, iterations=1)
        
        # 6. Geometric Contour Validation (Texture Rejection)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        accepted_cracks = []
        rejected_artifacts = []
        
        for cnt in contours:
            area = cv2.contourArea(cnt)
            peri = cv2.arcLength(cnt, True)
            
            # Basic size filter
            if area < 30 or peri < 40:
                rejected_artifacts.append(cnt)
                continue
                
            # Crack Geometry Metrics
            # 1. Aspect Ratio of Bounding Box (Cracks are usually elongated)
            x, y, w, h = cv2.boundingRect(cnt)
            rect_aspect_ratio = float(max(w, h)) / min(w, h)
            
            # 2. Solidity (Ratio of area to convex hull area)
            # Cracks are often "branchy" or thin, so they have low solidity compared to blobs
            hull = cv2.convexHull(cnt)
            hull_area = cv2.contourArea(hull)
            solidity = float(area) / hull_area if hull_area > 0 else 0
            
            # 3. Circularity (How close to a circle it is)
            # Cracks have very low circularity
            circularity = (4 * np.pi * area) / (peri * peri) if peri > 0 else 0
            
            # 4. Extent (Ratio of area to bounding box area)
            extent = float(area) / (w * h)
            
            # CRACK VALIDATION RULES:
            # - Must be elongated (high aspect ratio) OR 
            # - Must be complex/thin (low circularity AND low solidity)
            is_crack = (rect_aspect_ratio > 2.5) or (circularity < 0.2 and solidity < 0.5)
            
            # Reject compact blobs (likely texture noise or shadows)
            if extent > 0.6 and circularity > 0.4:
                is_crack = False
            
            if is_crack:
                accepted_cracks.append(cnt)
            else:
                rejected_artifacts.append(cnt)
        
        geometry = self._analyze_geometry(accepted_cracks, image.shape)
        
        return {
            "original": image,
            "enhanced": enhanced,
            "mask": mask,
            "contours": accepted_cracks,
            "rejected_contours": rejected_artifacts,
            "geometry": geometry
        }

    def _analyze_geometry(self, contours, img_shape):
        """
        Calculates physical properties of detected crack regions.
        """
        if not contours:
            return {"total_length": 0, "max_width": 0, "density": 0, "area_percentage": 0}
            
        total_area = 0
        max_width = 0
        total_length = 0
        
        for cnt in contours:
            area = cv2.contourArea(cnt)
            total_area += area
            
            # Approximate length using perimeter
            peri = cv2.arcLength(cnt, True)
            total_length += peri / 2
            
            # Estimate width using area/length
            if peri > 0:
                width = (2 * area) / peri
                max_width = max(max_width, width)
        
        img_area = img_shape[0] * img_shape[1]
        density = len(contours) / (img_area / 10000) # Contours per 100x100 block
        area_pct = (total_area / img_area) * 100
        
        return {
            "total_length": round(total_length, 2),
            "max_width": round(max_width, 2),
            "density": round(density, 2),
            "area_percentage": round(area_pct, 4)
        }
