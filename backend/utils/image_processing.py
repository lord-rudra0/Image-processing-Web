import cv2
import numpy as np
from PIL import Image
from skimage import exposure, filters, feature, color, morphology
from scipy import ndimage

def apply_threshold(image, method='binary', threshold=127, block_size=11, c=2):
    """
    Apply advanced thresholding methods to an image.
    
    Parameters:
    - method: 'binary', 'adaptive', 'otsu', 'triangle'
    - threshold: threshold value for binary method
    - block_size: neighborhood size for adaptive method
    - c: constant subtracted from mean for adaptive method
    """
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    
    methods = {
        'binary': lambda: cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)[1],
        'adaptive': lambda: cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                                cv2.THRESH_BINARY, block_size, c),
        'otsu': lambda: cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        'triangle': lambda: cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_TRIANGLE)[1]
    }
    
    thresh = methods.get(method, methods['binary'])()
    return Image.fromarray(thresh)

def apply_edge_detection(image, method='canny', sigma=2, low_threshold=100, high_threshold=200):
    """
    Apply enhanced edge detection methods.
    
    Parameters:
    - method: 'canny', 'sobel', 'laplace', 'prewitt', 'roberts'
    - sigma: Gaussian smoothing parameter
    - low_threshold/high_threshold: Thresholds for Canny edge detection
    """
    img_array = np.array(image)
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    
    methods = {
        'canny': lambda: feature.canny(gray, sigma=sigma, low_threshold=low_threshold, 
                                     high_threshold=high_threshold),
        'sobel': lambda: filters.sobel(gray),
        'laplace': lambda: np.absolute(cv2.Laplacian(gray, cv2.CV_64F)),
        'prewitt': lambda: filters.prewitt(gray),
        'roberts': lambda: filters.roberts(gray)
    }
    
    edges = methods.get(method, methods['canny'])()
    return Image.fromarray((edges * 255).astype(np.uint8))

def apply_noise_reduction(image, method='gaussian', kernel_size=5, sigma=1.5):
    """
    Apply advanced noise reduction methods.
    
    Parameters:
    - method: 'gaussian', 'median', 'bilateral', 'nlmeans', 'wavelet'
    - kernel_size: size of the kernel for filtering
    - sigma: standard deviation for Gaussian filter
    """
    img_array = np.array(image)
    
    methods = {
        'gaussian': lambda: cv2.GaussianBlur(img_array, (kernel_size, kernel_size), sigma),
        'median': lambda: cv2.medianBlur(img_array, kernel_size),
        'bilateral': lambda: cv2.bilateralFilter(img_array, kernel_size, 75, 75),
        'nlmeans': lambda: cv2.fastNlMeansDenoisingColored(img_array, None, 10, 10, 7, 21),
        'wavelet': lambda: denoise_wavelet(img_array)
    }
    
    result = methods.get(method, methods['gaussian'])()
    return Image.fromarray(result)

def apply_morphological_operation(image, operation='dilate', kernel_size=5, iterations=1):
    """
    Apply advanced morphological operations.
    
    Parameters:
    - operation: 'dilate', 'erode', 'opening', 'closing', 'gradient', 'tophat', 'blackhat'
    - kernel_size: size of the structuring element
    - iterations: number of times to apply the operation
    """
    img_array = np.array(image)
    kernel = np.ones((kernel_size, kernel_size), np.uint8)
    
    operations = {
        'dilate': lambda: cv2.dilate(img_array, kernel, iterations=iterations),
        'erode': lambda: cv2.erode(img_array, kernel, iterations=iterations),
        'opening': lambda: cv2.morphologyEx(img_array, cv2.MORPH_OPEN, kernel),
        'closing': lambda: cv2.morphologyEx(img_array, cv2.MORPH_CLOSE, kernel),
        'gradient': lambda: cv2.morphologyEx(img_array, cv2.MORPH_GRADIENT, kernel),
        'tophat': lambda: cv2.morphologyEx(img_array, cv2.MORPH_TOPHAT, kernel),
        'blackhat': lambda: cv2.morphologyEx(img_array, cv2.MORPH_BLACKHAT, kernel)
    }
    
    result = operations.get(operation, operations['dilate'])()
    return Image.fromarray(result)

def apply_color_transformation(image, method='rgb_to_hsv', gamma=1.0):
    """
    Apply advanced color space transformations and adjustments.
    
    Parameters:
    - method: 'rgb_to_hsv', 'rgb_to_lab', 'gamma', 'equalize', 'autocontrast'
    - gamma: gamma correction value
    """
    img_array = np.array(image)
    
    transformations = {
        'rgb_to_hsv': lambda: cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV),
        'rgb_to_lab': lambda: cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB),
        'gamma': lambda: np.clip(((img_array / 255) ** gamma) * 255, 0, 255).astype(np.uint8),
        'equalize': lambda: exposure.equalize_hist(img_array),
        'autocontrast': lambda: exposure.rescale_intensity(img_array)
    }
    
    result = transformations.get(method, transformations['rgb_to_hsv'])()
    return Image.fromarray(result)

def apply_special_effect(image, effect='cartoon', strength=1.0):
    """
    Apply advanced artistic effects.
    
    Parameters:
    - effect: 'cartoon', 'oil_painting', 'pencil_sketch', 'watercolor', 'pixelate'
    - strength: intensity of the effect (0.0 to 1.0)
    """
    img_array = np.array(image)
    
    def cartoon_effect():
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        gray = cv2.medianBlur(gray, 5)
        edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, 
                                    cv2.THRESH_BINARY, 9, 9)
        color = cv2.bilateralFilter(img_array, 9, 300, 300)
        return cv2.bitwise_and(color, color, mask=edges)
    
    def watercolor_effect():
        img_water = cv2.stylization(img_array, sigma_s=60, sigma_r=0.6)
        return cv2.bilateralFilter(img_water, 9, 75, 75)
    
    def pixelate_effect():
        h, w = img_array.shape[:2]
        pixel_size = int(max(h, w) * 0.03 * strength)
        if pixel_size < 1: pixel_size = 1
        small = cv2.resize(img_array, (w // pixel_size, h // pixel_size))
        return cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
    
    effects = {
        'cartoon': cartoon_effect,
        'oil_painting': lambda: cv2.xphoto.oilPainting(img_array, 7, int(10 * strength)),
        'pencil_sketch': lambda: cv2.pencilSketch(img_array, sigma_s=60, 
                                                sigma_r=0.07, shade_factor=0.05)[1],
        'watercolor': watercolor_effect,
        'pixelate': pixelate_effect
    }
    
    result = effects.get(effect, effects['cartoon'])()
    return Image.fromarray(result)

def denoise_wavelet(image):
    """Helper function for wavelet denoising"""
    from skimage.restoration import denoise_wavelet as skimage_denoise_wavelet
    return (skimage_denoise_wavelet(image, multichannel=True, 
                                  convert2ycbcr=True) * 255).astype(np.uint8)

def apply_geometric_transform(image, operation='resize', **params):
    """
    Apply geometric transformations.
    
    Parameters:
    - operation: 'resize', 'rotate', 'affine', 'perspective'
    - params: transformation-specific parameters
    """
    img_array = np.array(image)
    
    operations = {
        'resize': lambda: cv2.resize(img_array, (params.get('width'), params.get('height'))),
        'rotate': lambda: cv2.rotate(img_array, params.get('angle')),
        'affine': lambda: cv2.warpAffine(img_array, params.get('matrix'), 
                                        (img_array.shape[1], img_array.shape[0])),
        'perspective': lambda: cv2.warpPerspective(img_array, params.get('matrix'), 
                                                 (img_array.shape[1], img_array.shape[0]))
    }
    
    result = operations.get(operation, operations['resize'])()
    return Image.fromarray(result)