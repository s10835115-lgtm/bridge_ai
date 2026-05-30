import cv2
import numpy as np
import tensorflow as tf
import os

def generate_gradcam_heatmap(model, img_array, last_conv_layer_name="Conv_1"):
    """
    Generates Grad-CAM heatmap for the given model and input image.
    """
    # 1. Create a model that maps the input image to the activations of the last conv layer
    # as well as the output predictions
    grad_model = tf.keras.models.Model(
        [model.inputs], [model.get_layer(last_conv_layer_name).output, model.output]
    )

    # 2. Compute the gradient of the top predicted class for our input image
    # with respect to the activations of the last conv layer
    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        class_channel = preds[:, 0]

    # 3. This is the gradient of the output neuron with regard to the output feature map of the last conv layer
    grads = tape.gradient(class_channel, last_conv_layer_output)

    # 4. This is a vector where each entry is the mean intensity of the gradient over a specific feature map channel
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # 5. We multiply each channel in the feature map array by "how important this channel is" 
    # with regard to the top predicted class, then sum all the channels to obtain the heatmap class activation
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # 6. For visualization, we will also normalize the heatmap between 0 & 1
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def save_heatmap(image_path, heatmap, output_path):
    """
    Overlays heatmap on the original image with edge-guided refinement.
    """
    img = cv2.imread(image_path)
    
    # 1. Resize heatmap to match original image size
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    
    # 2. Extract edges from original image to guide the heatmap
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    edges_dilated = cv2.dilate(edges, np.ones((3,3), np.uint8), iterations=1)
    
    # 3. Apply edge-guided focus: boost heatmap where edges exist
    # This helps the heatmap "stick" to the actual crack lines
    edge_mask = edges_dilated.astype(float) / 255.0
    refined_heatmap = heatmap * (0.7 + 0.3 * edge_mask)
    refined_heatmap = np.clip(refined_heatmap, 0, 1)
    
    # 4. Convert to color map
    heatmap_color = np.uint8(255 * refined_heatmap)
    heatmap_color = cv2.applyColorMap(heatmap_color, cv2.COLORMAP_JET)
    
    # 5. Superimpose with high transparency on non-crack areas
    # and lower transparency on crack areas
    superimposed_img = cv2.addWeighted(img, 0.6, heatmap_color, 0.4, 0)
    
    # Save
    cv2.imwrite(output_path, superimposed_img)
