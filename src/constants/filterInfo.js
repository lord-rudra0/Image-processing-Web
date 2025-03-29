export const filterInfo = {
  // Basic Filters
  brightness: {
    title: 'Brightness Filter',
    description: 'Adjusts the overall lightness or darkness of the image.',
    usage: 'Use the slider to increase or decrease brightness. Values above 100% make the image brighter, below 100% make it darker.',
    parameters: {
      'Range': '0-200%',
      'Default': '100%'
    }
  },
  contrast: {
    title: 'Contrast Filter',
    description: 'Adjusts the difference between the light and dark areas of the image.',
    usage: 'Higher values increase contrast, lower values decrease it.',
    parameters: {
      'Range': '0-200%',
      'Default': '100%'
    }
  },
  // Edge Detection
  canny: {
    title: 'Canny Edge Detection',
    description: 'A multi-stage algorithm that detects edges in images with noise suppression.',
    usage: 'Best for detecting precise edges in images with some noise.',
    parameters: {
      'Threshold1': 'Lower threshold for edge linking',
      'Threshold2': 'Upper threshold for edge detection',
      'Aperture': 'Size of Sobel kernel'
    }
  },
  // Morphological Operations
  dilate: {
    title: 'Dilation',
    description: 'Expands or thickens objects in the image.',
    usage: 'Useful for joining broken parts of an object or increasing object size.',
    parameters: {
      'Kernel Size': 'Size of the dilation matrix',
      'Iterations': 'Number of times to apply the dilation'
    }
  },
  // Special Effects
  cartoon: {
    title: 'Cartoon Effect',
    description: 'Transforms the image into a cartoon-like style.',
    usage: 'Creates a stylized version of the image with simplified colors and enhanced edges.',
    parameters: {
      'Strength': 'Intensity of the cartoon effect',
      'Edge Threshold': 'Sensitivity of edge detection'
    }
  },
  // Add more filter information...
}; 