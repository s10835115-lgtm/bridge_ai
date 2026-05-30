import os

# macOS Fix: Stability environment variables
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

import ssl
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
import matplotlib.pyplot as plt
import shutil

# Bypass SSL for weight download
ssl._create_default_https_context = ssl._create_unverified_context

# Configuration
DATA_DIR = "/Users/shree/Downloads/manju's web/backend/ai/data/structured_dataset"
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), '../models/crack_detector.h5')
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32

def load_datasets():
    print("Loading datasets with enhanced augmentation...")
    
    # Data Augmentation Layer
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.2),
        layers.RandomContrast(0.2),
        layers.RandomBrightness(0.2),
    ])

    train_ds = tf.keras.utils.image_dataset_from_directory(
        os.path.join(DATA_DIR, 'train'),
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='binary',
        shuffle=True
    )
    
    val_ds = tf.keras.utils.image_dataset_from_directory(
        os.path.join(DATA_DIR, 'validation'),
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='binary'
    )
    
    class_names = train_ds.class_names
    print(f"Detected Classes: {class_names}")
    
    # FIX: Ensure Crack=1 and No_Crack=0
    # If alphabetical order is [crack, no_crack], then crack=0, no_crack=1.
    # We need to flip them if they are in that order.
    if class_names[0] == 'crack':
        print("Flipping labels to ensure Crack=1, No_Crack=0")
        train_ds = train_ds.map(lambda x, y: (x, 1 - y))
        val_ds = val_ds.map(lambda x, y: (x, 1 - y))

    # Apply Augmentation and standard MobileNetV2 preprocessing
    train_ds = train_ds.map(lambda x, y: (data_augmentation(x, training=True), y))
    train_ds = train_ds.map(lambda x, y: (preprocess_input(x), y))
    val_ds = val_ds.map(lambda x, y: (preprocess_input(x), y))
    
    return train_ds, val_ds, class_names

def build_model():
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Phase 1: Freeze backbone
    base_model.trainable = False
    
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-4),
        loss='binary_crossentropy',
        metrics=['accuracy', tf.keras.metrics.Precision(name='precision'), tf.keras.metrics.Recall(name='recall')]
    )
    return model, base_model

def train():
    train_ds, val_ds, class_names = load_datasets()
    model, base_model = build_model()
    
    # Callbacks
    checkpoint = callbacks.ModelCheckpoint(MODEL_SAVE_PATH, monitor='val_accuracy', save_best_only=True, mode='max', verbose=1)
    early_stop = callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    reduce_lr = callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1e-7)
    
    print("\n--- PHASE 1: Training Top Classifier ---")
    model.fit(
        train_ds,
        epochs=10,
        validation_data=val_ds,
        callbacks=[checkpoint, early_stop, reduce_lr]
    )
    
    print("\n--- PHASE 2: Fine-Tuning Backbone ---")
    # Unfreeze top layers of MobileNetV2
    base_model.trainable = True
    # Freeze only the very early layers (bottom 50) to allow more feature adaptation
    for layer in base_model.layers[:50]:
        layer.trainable = False
        
    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-5), # Lower LR for fine-tuning
        loss='binary_crossentropy',
        metrics=['accuracy', tf.keras.metrics.Precision(name='precision'), tf.keras.metrics.Recall(name='recall')]
    )
    
    model.fit(
        train_ds,
        epochs=30, # Increased epochs for better convergence
        validation_data=val_ds,
        callbacks=[checkpoint, early_stop, reduce_lr]
    )
    
    print(f"Final training complete. Best model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train()
