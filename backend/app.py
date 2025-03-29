from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import cv2
import numpy as np
import io
import base64
from .utils.image_processing import *

app = Flask(__name__)
CORS(app)

def base64_to_image(base64_string):
    if 'data:image' in base64_string:
        base64_string = base64_string.split(',')[1]
    image_data = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(image_data))
    return image

def image_to_base64(image):
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

@app.route('/api/process', methods=['POST'])
def process_image():
    try:
        data = request.json
        image_data = data['image']
        operations = data['operations']
        
        image = base64_to_image(image_data)
        
        processors = {
            'threshold': apply_threshold,
            'edge_detection': apply_edge_detection,
            'noise_reduction': apply_noise_reduction,
            'morphological': apply_morphological_operation,
            'color_transformation': apply_color_transformation,
            'special_effect': apply_special_effect
        }
        
        for operation in operations:
            processor = processors.get(operation['type'])
            if processor:
                image = processor(image, **operation['params'])
        
        processed_image = image_to_base64(image)
        return jsonify({
            'status': 'success',
            'image': f'data:image/png;base64,{processed_image}'
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/filters', methods=['GET'])
def get_available_filters():
    return jsonify({
        'threshold': {
            'methods': ['binary', 'adaptive', 'otsu', 'triangle'],
            'params': {
                'threshold': {'min': 0, 'max': 255, 'default': 127},
                'block_size': {'min': 3, 'max': 21, 'default': 11},
                'c': {'min': -10, 'max': 10, 'default': 2}
            }
        },
        'edge_detection': {
            'methods': ['canny', 'sobel', 'laplace', 'prewitt', 'roberts'],
            'params': {
                'sigma': {'min': 0.1, 'max': 5.0, 'default': 2.0},
                'low_threshold': {'min': 0, 'max': 255, 'default': 100},
                'high_threshold': {'min': 0, 'max': 255, 'default': 200}
            }
        },
        'noise_reduction': {
            'methods': ['gaussian', 'median', 'bilateral', 'nlmeans', 'wavelet'],
            'params': {
                'kernel_size': {'min': 3, 'max': 15, 'default': 5},
                'sigma': {'min': 0.1, 'max': 5.0, 'default': 1.5}
            }
        },
        'morphological': {
            'operations': ['dilate', 'erode', 'opening', 'closing', 'gradient', 'tophat', 'blackhat'],
            'params': {
                'kernel_size': {'min': 3, 'max': 15, 'default': 5},
                'iterations': {'min': 1, 'max': 10, 'default': 1}
            }
        },
        'color_transformation': {
            'methods': ['rgb_to_hsv', 'rgb_to_lab', 'gamma', 'equalize', 'autocontrast'],
            'params': {
                'gamma': {'min': 0.1, 'max': 5.0, 'default': 1.0}
            }
        },
        'special_effect': {
            'effects': ['cartoon', 'oil_painting', 'pencil_sketch', 'watercolor', 'pixelate'],
            'params': {
                'strength': {'min': 0.1, 'max': 1.0, 'default': 0.5}
            }
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)