from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import cv2
import numpy as np
import io
import base64
import os
from utils.image_processing import (
    apply_threshold,
    apply_edge_detection,
    apply_noise_reduction,
    apply_morphological_operation,
    apply_color_transformation,
    apply_special_effect,
    apply_geometric_transform
)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def base64_to_image(base64_string):
    try:
        if 'data:image' in base64_string:
            base64_string = base64_string.split(',')[1]
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        return image
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

def image_to_base64(image):
    try:
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode()
    except Exception as e:
        raise ValueError(f"Error converting image to base64: {str(e)}")

@app.route('/api/process', methods=['POST'])
def process_image():
    try:
        data = request.json
        if not data or 'image' not in data or 'operations' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400

        image_data = data['image']
        operations = data['operations']
        
        # Convert base64 to PIL Image
        image = base64_to_image(image_data)
        
        # Define available processors
        processors = {
            'threshold': apply_threshold,
            'edge_detection': apply_edge_detection,
            'noise_reduction': apply_noise_reduction,
            'morphological': apply_morphological_operation,
            'color_transformation': apply_color_transformation,
            'special_effect': apply_special_effect,
            'geometric': apply_geometric_transform
        }
        
        # Apply each operation in sequence
        for operation in operations:
            if 'type' not in operation or 'params' not in operation:
                continue
                
            processor = processors.get(operation['type'])
            if processor:
                try:
                    image = processor(image, **operation['params'])
                except Exception as e:
                    print(f"Error applying {operation['type']}: {str(e)}")
                    continue
        
        # Convert back to base64
        processed_image = image_to_base64(image)
        
        return jsonify({
            'status': 'success',
            'image': f'data:image/png;base64,{processed_image}'
        })
        
    except Exception as e:
        print(f"Processing error: {str(e)}")
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

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({
        'status': 'success',
        'message': 'Server is running'
    })

@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No image selected'}), 400

    try:
        img = Image.open(image)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
        img.save(filepath)
        return jsonify({'message': 'Image uploaded successfully', 'filename': image.filename}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/compress', methods=['POST'])
def compress_image():
    data = request.get_json()
    filename = data.get('filename')
    quality = data.get('quality', 85)  # Default quality

    if not filename:
        return jsonify({'error': 'No filename provided'}), 400

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'Image not found'}), 404

    try:
        img = Image.open(filepath)
        compressed_buffer = io.BytesIO()
        img.save(compressed_buffer, format="JPEG", optimize=True, quality=quality)
        compressed_buffer.seek(0)
        # Convert to base64 string
        img_byte_arr = compressed_buffer.read()
        img_str = base64.b64encode(img_byte_arr).decode('utf-8')
        return jsonify({'image': img_str, 'message': 'Image compressed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/resize', methods=['POST'])
def resize_image():
    data = request.get_json()
    filename = data.get('filename')
    width = data.get('width')
    height = data.get('height')

    if not filename or not width or not height:
        return jsonify({'error': 'Filename, width, and height are required'}), 400

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'Image not found'}), 404

    try:
        img = Image.open(filepath)
        img = img.resize((width, height))
        resized_buffer = io.BytesIO()
        img.save(resized_buffer, format="JPEG")
        resized_buffer.seek(0)
        # Convert to base64 string
        img_byte_arr = resized_buffer.read()
        img_str = base64.b64encode(img_byte_arr).decode('utf-8')
        return jsonify({'image':  img_str, 'message': 'Image resized successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/crop', methods=['POST'])
def crop_image():
    data = request.get_json()
    filename = data.get('filename')
    left = data.get('left')
    top = data.get('top')
    right = data.get('right')
    bottom = data.get('bottom')

    if not filename or not all([left, top, right, bottom]):
        return jsonify({'error': 'Filename and crop coordinates are required'}), 400

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'Image not found'}), 404

    try:
        img = Image.open(filepath)
        img = img.crop((left, top, right, bottom))
        cropped_buffer = io.BytesIO()
        img.save(cropped_buffer, format="JPEG")
        cropped_buffer.seek(0)
        # Convert to base64 string
        img_byte_arr = cropped_buffer.read()
        img_str = base64.b64encode(img_byte_arr).decode('utf-8')
        return jsonify({'image': img_str, 'message': 'Image cropped successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/convert-to-jpg', methods=['POST'])
def convert_to_jpg():
    data = request.get_json()
    filename = data.get('filename')

    if not filename:
        return jsonify({'error': 'No filename provided'}), 400

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'Image not found'}), 404

    try:
        img = Image.open(filepath)
        jpg_buffer = io.BytesIO()
        img.convert('RGB').save(jpg_buffer, format="JPEG")
        jpg_buffer.seek(0)
        # Convert to base64 string
        img_byte_arr = jpg_buffer.read()
        img_str = base64.b64encode(img_byte_arr).decode('utf-8')
        return jsonify({'image': img_str, 'message': 'Image converted to JPG successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)