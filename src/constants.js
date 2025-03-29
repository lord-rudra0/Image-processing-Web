export const filterCategories = [
  {
    name: 'Basic Adjustments',
    filters: [
      {
        name: 'Brightness',
        type: 'range',
        min: 0,
        max: 200,
        default: 100,
        unit: '%',
        cssProperty: 'brightness'
      },
      {
        name: 'Contrast',
        type: 'range',
        min: 0,
        max: 200,
        default: 100,
        unit: '%',
        cssProperty: 'contrast'
      },
      {
        name: 'Saturation',
        type: 'range',
        min: 0,
        max: 200,
        default: 100,
        unit: '%',
        cssProperty: 'saturate'
      },
      {
        name: 'Opacity',
        type: 'range',
        min: 0,
        max: 100,
        default: 100,
        unit: '%',
        cssProperty: 'opacity'
      }
    ]
  },
  {
    name: 'Color Effects',
    filters: [
      {
        name: 'Hue Rotate',
        type: 'range',
        min: 0,
        max: 360,
        default: 0,
        unit: 'deg',
        cssProperty: 'hue-rotate'
      },
      {
        name: 'Sepia',
        type: 'range',
        min: 0,
        max: 100,
        default: 0,
        unit: '%',
        cssProperty: 'sepia'
      },
      {
        name: 'Grayscale',
        type: 'range',
        min: 0,
        max: 100,
        default: 0,
        unit: '%',
        cssProperty: 'grayscale'
      },
      {
        name: 'Invert',
        type: 'range',
        min: 0,
        max: 100,
        default: 0,
        unit: '%',
        cssProperty: 'invert'
      }
    ]
  },
  {
    name: 'Blur & Sharpen',
    filters: [
      {
        name: 'Blur',
        type: 'range',
        min: 0,
        max: 20,
        default: 0,
        unit: 'px',
        cssProperty: 'blur'
      }
    ]
  },
  {
    name: 'Transform',
    filters: [
      {
        name: 'Scale',
        type: 'range',
        min: 50,
        max: 150,
        default: 100,
        unit: '%',
        transform: true
      },
      {
        name: 'Rotate',
        type: 'range',
        min: 0,
        max: 360,
        default: 0,
        unit: 'deg',
        transform: true
      }
    ]
  },
  {
    name: 'Advanced Processing',
    filters: [
      {
        name: 'Threshold',
        type: 'select',
        options: ['binary', 'adaptive', 'otsu', 'triangle'],
        params: {
          threshold: { min: 0, max: 255, default: 127 }
        }
      },
      {
        name: 'Edge Detection',
        type: 'select',
        options: ['canny', 'sobel', 'laplace', 'prewitt', 'roberts'],
        params: {
          sigma: { min: 0.1, max: 5.0, default: 2.0 }
        }
      },
      // Add more advanced filters...
    ]
  },
  {
    name: 'Transformations',
    filters: [
      {
        name: 'Rotate',
        type: 'range',
        min: 0,
        max: 360,
        default: 0,
        unit: 'deg'
      },
      // Add more transformation options...
    ]
  }
];