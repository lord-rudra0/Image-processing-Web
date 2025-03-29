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

def process_image(filename, operation, **kwargs):
    try:
        img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        img = Image.open(img_path)
        original_size = os.path.getsize(img_path)  # Get original size in bytes
        img_format = img.format.lower()

        if operation == 'compress':
            quality = kwargs.get('quality', 85)
            img_io = io.BytesIO()
            img.save(img_io, img_format, optimize=True, quality=quality)
            compressed_size = img_io.tell()  # Get compressed size in bytes
            img_io.seek(0)
            img_base64 = base64.b64encode(img_io.read()).decode('utf-8')
        elif operation == 'resize':
            width = kwargs.get('width')
            height = kwargs.get('height')
            img = img.resize((width, height))
            img_io = io.BytesIO()
            img.save(img_io, img_format)
            compressed_size = img_io.tell()
            img_io.seek(0)
            img_base64 = base64.b64encode(img_io.read()).decode('utf-8')
        elif operation == 'crop':
            left = kwargs.get('left')
            top = kwargs.get('top')
            right = kwargs.get('right')
            bottom = kwargs.get('bottom')
            img = img.crop((left, top, right, bottom))
            img_io = io.BytesIO()
            img.save(img_io, img_format)
            compressed_size = img_io.tell()
            img_io.seek(0)
            img_base64 = base64.b64encode(img_io.read()).decode('utf-8')
        elif operation == 'convert-to-jpg':
            img = img.convert('RGB')
            img_io = io.BytesIO()
            img.save(img_io, 'JPEG')
            compressed_size = img_io.tell()
            img_io.seek(0)
            img_base64 = base64.b64encode(img_io.read()).decode('utf-8')
        else:
            raise ValueError(f"Unsupported operation: {operation}")

        # Convert sizes to KB and format to two decimal places
        original_size_kb = round(original_size / 1024, 2)
        compressed_size_kb = round(compressed_size / 1024, 2)

        return jsonify({
            'success': True,
            'img': img_base64,
            'original_size': original_size_kb,
            'compressed_size': compressed_size_kb
        })

    except FileNotFoundError:
        return jsonify({'success': False, 'error': 'File not found.'}), 404
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'success': False, 'error': 'Image processing failed.'}), 500

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
def compress():
    try:
        data = request.get_json()
        filename = data['filename']
        quality = int(data.get('quality', 85))  # Default to 85 if not provided

        result = process_image(filename, 'compress', quality=quality)
        return result
    except KeyError as e:
        return jsonify({'success': False, 'error': f'Missing parameter: {str(e)}'}), 400
    except Exception as e:
        print(f"Error during compression: {e}")
        return jsonify({'success': False, 'error': 'Compression failed'}), 500

@app.route('/api/resize', methods=['POST'])
def resize_image():
    try:
        data = request.get_json()
        filename = data['filename']
        resize_option = data.get('resizeOption', 'dimensions')
        format = data.get('format', 'jpeg')
        quality = int(data.get('quality', 90))

        if resize_option == 'dimensions':
            width = int(data['width'])
            height = int(data['height'])
            result = process_image(filename, 'resize', width=width, height=height, format=format, quality=quality)
        elif resize_option == 'percent':
            percent = float(data['percent'])
            result = process_image(filename, 'resize', percent=percent, format=format, quality=quality)
        elif resize_option == 'resolution':
            width = int(data['width'])
            height = int(data['height'])
            dpi = int(data.get('dpi', 72))
            result = process_image(filename, 'resize', width=width, height=height, format=format, quality=quality, dpi=dpi)

        return result

    except KeyError as e:
        return jsonify({'success': False, 'error': f'Missing parameter: {str(e)}'}), 400
    except FileNotFoundError:
        return jsonify({'success': False, 'error': 'Image not found'}), 404
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/crop', methods=['POST'])
def crop_image():
    try:
        data = request.get_json()
        filename = data.get('filename')
        left = data.get('left')
        top = data.get('top')
        right = data.get('right')
        bottom = data.get('bottom')

        if not filename or not all([left, top, right, bottom]):
            return jsonify({'error': 'Filename and crop coordinates are required'}), 400

        img_str = process_image(filename, 'crop', {'left': left, 'top': top, 'right': right, 'bottom': bottom})
        return jsonify({'image': img_str, 'message': 'Image cropped successfully'}), 200

    except FileNotFoundError:
        return jsonify({'error': 'Image not found'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/convert-to-jpg', methods=['POST'])
def convert_to_jpg():
    try:
        data = request.get_json()
        filename = data.get('filename')

        if not filename:
            return jsonify({'error': 'No filename provided'}), 400

        img_str = process_image(filename, 'convert-to-jpg')
        return jsonify({'image': img_str, 'message': 'Image converted to JPG successfully'}), 200

    except FileNotFoundError:
        return jsonify({'error': 'Image not found'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
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

def process_image(filename, operation, **kwargs):
    try:
        img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        img = Image.open(img_path)
        original_size = os.path.getsize(img_path)  # Get original size in bytes
        original_format = img.format.lower()
        img_format = kwargs.get('format', original_format)

        if operation == 'compress':
            quality = kwargs.get('quality', 85)
            img_io = io.BytesIO()
            img.save(img_io, img_format, optimize=True, quality=quality)
            compressed_size = img_io.tell()  # Get compressed size in bytes
            img_io.seek(0)
            img_base64 = base64.b64encode(img_io.read()).decode('utf-8')
        elif operation == 'resize':
            width = kwargs.get('width')
            height = kwargs.get('height')
            percent = kwargs.get('percent')
            dpi = kwargs.get('dpi')
            quality = kwargs.get('quality', 85)

            if width and height:
                img = img.resize((width, height))
            elif percent:
                width = int(img.width * (percent / 100))
                height = int(img.height * (percent / 100))
                img = img.resize((width, height))

            img_io = io.BytesIO()
            img.save(img_io, img_format, quality=quality, dpi=(dpi, dpi))
            compressed_size = img_io.tell()
            img_io.seek(0)
            img_base64 = base64.b64encode(img_io.read()).decode('utf-8')
        elif operation == 'crop':
            left = kwargs.get('left')
            top = kwargs.get('top')
            right = kwargs.get('right')
            bottom = kwargs.get('bottom')
            img = img.crop((left, top, right, bottom))
            img_io = io.BytesIO()
            img.save(img_io, img_format)
            compressed_size = img_io.tell()
            img_io.seek(0)
            img_base64 = base64.b64encode(img_io.read()).decode('utf-8')
        elif operation == 'convert-to-jpg':
            img = img.convert('RGB')
            img_io = io.BytesIO()
            img.save(img_io, 'JPEG')
            compressed_size = img_io.tell()
            img_io.seek(0)
            img_base64 = base64.b64encode(img_io.read()).decode('utf-8')
        else:
            raise ValueError(f"Unsupported operation: {operation}")

        # Convert sizes to KB and format to two decimal places
        original_size_kb = round(original_size / 1024, 2)
        compressed_size_kb = round(compressed_size / 1024, 2)

        return jsonify({
            'success': True,
            'img': img_base64,
            'original_size': original_size_kb,
            'compressed_size': compressed_size_kb
        })

    except FileNotFoundError:
        return jsonify({'success': False, 'error': 'File not found.'}), 404
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'success': False, 'error': 'Image processing failed.'}), 500

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
def compress():
    try:
        data = request.get_json()
        filename = data['filename']
        quality = int(data.get('quality', 85))  # Default to 85 if not provided

        result = process_image(filename, 'compress', quality=quality)
        return result
    except KeyError as e:
        return jsonify({'success': False, 'error': f'Missing parameter: {str(e)}'}), 400
    except Exception as e:
        print(f"Error during compression: {e}")
        return jsonify({'success': False, 'error': 'Compression failed'}), 500

@app.route('/api/resize', methods=['POST'])
def resize_image():
    try:
        data = request.get_json()
        filename = data['filename']
        resize_option = data.get('resizeOption', 'dimensions')
        format = data.get('format', 'jpeg')
        quality = int(data.get('quality', 90))

        if resize_option == 'dimensions':
            width = int(data['width'])
            height = int(data['height'])
            result = process_image(filename, 'resize', width=width, height=height, format=format, quality=quality)
        elif resize_option == 'percent':
            percent = float(data['percent'])
            result = process_image(filename, 'resize', percent=percent, format=format, quality=quality)
        elif resize_option == 'resolution':
            width = int(data['width'])
            height = int(data['height'])
            dpi = int(data.get('dpi', 72))
            result = process_image(filename, 'resize', width=width, height=height, format=format, quality=quality, dpi=dpi)

        return result

    except KeyError as e:
        return jsonify({'success': False, 'error': f'Missing parameter: {str(e)}'}), 400
    except FileNotFoundError:
        return jsonify({'success': False, 'error': 'Image not found'}), 404
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/crop', methods=['POST'])
def crop_image():
    try:
        data = request.get_json()
        filename = data.get('filename')
        left = data.get('left')
        top = data.get('top')
        right = data.get('right')
        bottom = data.get('bottom')

        if not filename or not all([left, top, right, bottom]):
            return jsonify({'error': 'Filename and crop coordinates are required'}), 400

        img_str = process_image(filename, 'crop', {'left': left, 'top': top, 'right': right, 'bottom': bottom})
        return jsonify({'image': img_str, 'message': 'Image cropped successfully'}), 200

    except FileNotFoundError:
        return jsonify({'error': 'Image not found'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/convert-to-jpg', methods=['POST'])
def convert_to_jpg():
    try:
        data = request.get_json()
        filename = data.get('filename')

        if not filename:
            return jsonify({'error': 'No filename provided'}), 400

        img_str = process_image(filename, 'convert-to-jpg')
        return jsonify({'image': img_str, 'message': 'Image converted to JPG successfully'}), 200

    except FileNotFoundError:
        return jsonify({'error': 'Image not found'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)