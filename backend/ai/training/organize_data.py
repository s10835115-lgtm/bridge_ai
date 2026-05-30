import os
import shutil
import random

# Configuration
SOURCE_BASE = "/Users/shree/Downloads/manju's web/DATA_Maguire_20180517_ALL/SDNET2018"
DEST_BASE = "/Users/shree/Downloads/manju's web/backend/ai/data/structured_dataset"

# SDNET structure mapping
# D: Decks, P: Pavement, W: Walls
# CD/CP/CW: Cracked, UD/UP/UW: Uncracked
MAPPING = {
    'D': ('CD', 'UD'),
    'P': ('CP', 'UP'),
    'W': ('CW', 'UW')
}

def organize_data():
    # Create structure
    for split in ['train', 'validation']:
        for category in ['crack', 'no_crack']:
            os.makedirs(os.path.join(DEST_BASE, split, category), exist_ok=True)

    # Collect images
    for main_folder, (crack_sub, uncrack_sub) in MAPPING.items():
        print(f"Processing structural category: {main_folder}")
        
        # 1. Process Cracked
        crack_path = os.path.join(SOURCE_BASE, main_folder, crack_sub)
        if os.path.exists(crack_path):
            imgs = [f for f in os.listdir(crack_path) if f.lower().endswith(('.jpg', '.jpeg'))]
            random.shuffle(imgs)
            
            # Use 2000 images per category for high quality training
            limit = min(len(imgs), 2000)
            train_count = int(limit * 0.8)
            
            for i, img in enumerate(imgs[:limit]):
                split = 'train' if i < train_count else 'validation'
                src = os.path.join(crack_path, img)
                dst = os.path.join(DEST_BASE, split, 'crack', f"{main_folder}_{img}")
                shutil.copy(src, dst)
        
        # 2. Process Uncracked
        uncrack_path = os.path.join(SOURCE_BASE, main_folder, uncrack_sub)
        if os.path.exists(uncrack_path):
            imgs = [f for f in os.listdir(uncrack_path) if f.lower().endswith(('.jpg', '.jpeg'))]
            random.shuffle(imgs)
            
            # Match the limit for balanced dataset
            limit = min(len(imgs), 2000)
            train_count = int(limit * 0.8)
            
            for i, img in enumerate(imgs[:limit]):
                split = 'train' if i < train_count else 'validation'
                src = os.path.join(uncrack_path, img)
                dst = os.path.join(DEST_BASE, split, 'no_crack', f"{main_folder}_{img}")
                shutil.copy(src, dst)

    print(f"Dataset organization complete. Structured data located at: {DEST_BASE}")

if __name__ == "__main__":
    organize_data()
