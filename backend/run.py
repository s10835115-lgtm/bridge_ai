import os

# macOS Fix: Disable GPU acceleration and oneDNN optimizations to prevent segmentation faults
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
os.environ['OMP_NUM_THREADS'] = '1'

# Disable TensorFlow GPU visibility to prevent metal plugin crashes
import tensorflow as tf
try:
    tf.config.set_visible_devices([], 'GPU')
except:
    pass

from app import create_app

config_name = os.getenv('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == '__main__':
    # Use port 5001 as per user profile preferences
    app.run(host='0.0.0.0', port=5001, debug=(config_name == 'development'))
