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
  // Add missing filters
  saturation: {
    title: 'Saturation Filter',
    description: 'Adjusts the intensity of colors in the image.',
    usage: 'Use the slider to increase or decrease color intensity. Values above 100% make colors more vibrant, below 100% make them more muted.',
    parameters: {
      'Range': '0-200%',
      'Default': '100%'
    }
  },
  
  gaussian: {
    title: 'Gaussian Blur',
    description: 'Applies a smooth blur effect.',
    usage: 'Use for general noise reduction and smoothing.',
    parameters: {
      'Kernel Size': 'Controls blur intensity',
      'Sigma': 'Controls spread of blur'
    }
  },

  median: {
    title: 'Median Filter',
    description: 'Removes noise while preserving edges.',
    usage: 'Best for removing salt-and-pepper noise.',
    parameters: {
      'Kernel Size': 'Controls filter strength'
    }
  },

  bilateral: {
    title: 'Bilateral Filter',
    description: 'Edge-preserving noise reduction.',
    usage: 'Smooths images while preserving important edges.',
    parameters: {
      'Sigma': 'Controls filter intensity'
    }
  },

  watercolor: {
    title: 'Watercolor Effect',
    description: 'Creates a watercolor painting effect.',
    usage: 'Artistic filter for photo stylization.',
    parameters: {
      'Strength': 'Controls effect intensity'
    }
  },

  oil_painting: {
    title: 'Oil Painting',
    description: 'Creates an oil painting effect.',
    usage: 'Artistic filter for photo stylization.',
    parameters: {
      'Strength': 'Controls effect intensity'
    }
  },

  pixelate: {
    title: 'Pixelate',
    description: 'Creates a pixelated effect.',
    usage: 'Reduces image to visible pixels.',
    parameters: {
      'Size': 'Controls pixel size'
    }
  },

  // Add other filters as needed...
}; 