from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, UnidentifiedImageError
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
from io import BytesIO

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

def process_image(image, filename, action, **kwargs):
    try:
        img = Image.open(image)
        image_format = img.format.lower()  # Store the original format

        if action == 'compress':
            quality = int(kwargs.get('quality', 85))
            img_io = BytesIO()
            img.save(img_io, image_format, quality=quality, optimize=True)
        elif action == 'resize':
            width = int(kwargs.get('width'))
            height = int(kwargs.get('height'))
            img = img.resize((width, height), Image.LANCZOS)
            img_io = BytesIO()
            img.save(img_io, image_format)
        elif action == 'crop':
            left = int(kwargs.get('left'))
            top = int(kwargs.get('top'))
            right = int(kwargs.get('right'))
            bottom = int(kwargs.get('bottom'))
            img = img.crop((left, top, right, bottom))
            img_io = BytesIO()
            img.save(img_io, image_format)
        elif action == 'convert-to-jpg':
            img = img.convert('RGB')
            img_io = BytesIO()
            img.save(img_io, 'JPEG', quality=85)
            image_format = 'jpeg'
        else:
            raise ValueError("Invalid action specified")

        img_io.seek(0)
        img_data = base64.b64encode(img_io.read()).decode('utf-8')
        img_size = len(img_data)  # Size after processing

        return {
            'processedImage': f'data:image/{image_format};base64,{img_data}',
            'size': img_size,
            'format': image_format
        }

    except FileNotFoundError:
        return {'error': 'File not found.'}
    except ValueError as e:
        return {'error': str(e)}
    except Exception as e:
        return {'error': str(e)}

@app.route('/api/process', methods=['POST'])
def process_image_route():
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
        return jsonify({'error': 'No image part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        return jsonify({'message': 'Image uploaded successfully', 'filename': file.filename}), 200

@app.route('/api/compress', methods=['POST'])
def compress_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    image = request.files['image']
    filename = request.form.get('filename')
    quality = request.form.get('quality', 85)

    result = process_image(image, filename, 'compress', quality=quality)
    if 'error' in result:
        return jsonify({'error': result['error']}), 400
    return jsonify(result), 200

@app.route('/api/resize', methods=['POST'])
def resize_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    image = request.files['image']
    filename = request.form.get('filename')
    width = request.form.get('width')
    height = request.form.get('height')

    result = process_image(image, filename, 'resize', width=width, height=height)
    if 'error' in result:
        return jsonify({'error': result['error']}), 400
    return jsonify(result), 200

@app.route('/api/crop', methods=['POST'])
def crop_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    image = request.files['image']
    filename = request.form.get('filename')
    left = request.form.get('left')
    top = request.form.get('top')
    right = request.form.get('right')
    bottom = request.form.get('bottom')

    result = process_image(image, filename, 'crop', left=left, top=top, right=right, bottom=bottom)
    if 'error' in result:
        return jsonify({'error': result['error']}), 400
    return jsonify(result), 200

@app.route('/api/convert-to-jpg', methods=['POST'])
def convert_to_jpg():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    image = request.files['image']
    filename = request.form.get('filename')

    result = process_image(image, filename, 'convert-to-jpg')
    if 'error' in result:
        return jsonify({'error': result['error']}), 400
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)