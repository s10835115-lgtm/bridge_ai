import os
from PIL import Image
import pillow_avif  # Important for registration
import uuid

def convert_to_standard_format(input_path, output_dir):
    """
    Detects if an image is in AVIF or WebP format and converts it to a standard RGB PNG
    for OpenCV and TensorFlow compatibility.
    
    Args:
        input_path (str): Path to the uploaded image.
        output_dir (str): Directory to save the converted image.
        
    Returns:
        str: Path to the converted image, or original path if no conversion was needed.
    """
    ext = os.path.splitext(input_path)[1].lower()
    
    # List of formats that require conversion for better OpenCV/TF compatibility
    modern_formats = ['.avif', '.webp']
    
    if ext not in modern_formats:
        return input_path

    try:
        # Load image with Pillow
        with Image.open(input_path) as img:
            # Ensure it's in RGB mode (removes transparency/alpha channel for AI compatibility)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Create a unique filename for the converted image
            new_filename = f"conv_{uuid.uuid4().hex}.png"
            output_path = os.path.join(output_dir, new_filename)
            
            # Save as high-quality PNG
            img.save(output_path, 'PNG', optimize=True)
            
            print(f"--- CONVERSION UTILITY ---")
            print(f"Format: {ext.upper()} -> PNG")
            print(f"Original: {os.path.basename(input_path)}")
            print(f"Converted: {new_filename}")
            print(f"--------------------------")
            
            return output_path
            
    except Exception as e:
        print(f"Conversion Error ({ext}): {str(e)}")
        # If conversion fails, return original and let downstream handles it (or fails gracefully)
        return input_path
